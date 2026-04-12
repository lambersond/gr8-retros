'use client'

import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { STYLES } from '../styles'
import type {
  ReportDetailsColumnCard,
  ReportDetailsDocumentProps,
} from './types'

function formatDuration(ms: number) {
  const totalSec = Math.round(ms / 1000)
  if (totalSec < 60) return `${totalSec}s`
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`
}

function CardView({
  card,
  borderColor,
}: Readonly<{
  card: ReportDetailsColumnCard
  borderColor: string
}>) {
  return (
    <View style={[STYLES.card, { borderLeftColor: borderColor }]} wrap={false}>
      <Text style={STYLES.cardContent}>{card.title}</Text>
      <Text style={STYLES.cardMeta}>
        {card.votes} upvotes · {card.submittedBy}
      </Text>

      {card.actionItems.length > 0 &&
        card.actionItems.map(item => (
          <View key={item.id} style={STYLES.actionItem}>
            <Text
              style={[STYLES.checkmark, STYLES.checkbox]}
              render={() => (item.completed ? 'X' : '')}
            />
            <Text style={[STYLES.actionItemText]}>{item.content}</Text>
            {item.assignedTo && (
              <Text style={STYLES.actionItemAssignee}>— {item.assignedTo}</Text>
            )}
          </View>
        ))}

      {card.comments.length > 0 &&
        card.comments.map(comment => (
          <View key={comment.id} style={STYLES.commentItem}>
            <Text style={STYLES.commentBubble}>comment</Text>
            <Text style={STYLES.commentText}>{comment.content}</Text>
            <Text style={STYLES.commentAuthor}>— {comment.author}</Text>
          </View>
        ))}
    </View>
  )
}

export function ReportDetailsDocument({
  title = 'Gr8 Retro Board Report',
  date = new Date(),
  summary,
  stats,
  columns,
  sessionData,
}: Readonly<ReportDetailsDocumentProps>) {
  // Filter details to only cards with action items or undiscussed cards
  const filteredColumns = columns
    .map(column => ({
      ...column,
      cards: column.cards.filter(
        card => card.actionItems.length > 0 || !card.isDiscussed,
      ),
    }))
    .filter(column => column.cards.length > 0)

  return (
    <Document>
      <Page size='A4' style={STYLES.page}>
        {/* Header */}
        <View style={STYLES.header}>
          <Text style={STYLES.headerTitle}>{title}</Text>
          <View style={STYLES.headerMeta}>
            <Text style={STYLES.headerMetaItem}>{format(date, 'PPP')}</Text>
            {sessionData && sessionData.participants.length > 0 && (
              <Text style={STYLES.headerMetaItem}>
                {sessionData.participants.length} participants
              </Text>
            )}
          </View>
        </View>

        {/* Session Metrics */}
        <View style={STYLES.statsContainer}>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>
              {stats.totalCards - stats.totalDiscussed}/{stats.totalCards}
            </Text>
            <Text style={STYLES.statLabel}>Cards (undiscussed/total)</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>
              {stats.totalActions - stats.completedActions}/{stats.totalActions}
            </Text>
            <Text style={STYLES.statLabel}>Action Items (open/total)</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalGroups}</Text>
            <Text style={STYLES.statLabel}>Groups</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalVotes}</Text>
            <Text style={STYLES.statLabel}>Votes</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalComments}</Text>
            <Text style={STYLES.statLabel}>Comments</Text>
          </View>
        </View>

        {/* Participants */}
        {sessionData && sessionData.participants.length > 0 && (
          <View style={STYLES.participantsContainer} wrap={false}>
            <Text style={STYLES.participantsTitle}>Participants</Text>
            <Text style={STYLES.participantsText}>
              {sessionData.participants.map(p => p.name).join(', ')}
            </Text>
          </View>
        )}

        {/* AI Summary */}
        {summary && (
          <View style={STYLES.summaryContainer} wrap={false}>
            <Text style={STYLES.summaryTitle}>Session Summary</Text>
            <Text style={STYLES.summaryText}>{summary}</Text>
          </View>
        )}

        {/* Discussion Timings */}
        {sessionData && sessionData.discussionTimings.length > 0 && (
          <View style={STYLES.timingsContainer} wrap={false}>
            <Text style={STYLES.timingsTitle}>Discussion Time</Text>
            {sessionData.discussionTimings.map(timing => (
              <View
                key={`${timing.column}-${timing.label}`}
                style={STYLES.timingRow}
              >
                <Text style={STYLES.timingLabel}>{timing.label}</Text>
                <Text style={STYLES.timingDuration}>
                  {formatDuration(timing.durationMs)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Details — only cards with action items or undiscussed */}
        {filteredColumns.length > 0 && (
          <>
            <Text style={STYLES.sectionTitle}>
              Action Items &amp; Undiscussed Cards
            </Text>
            {filteredColumns.map(column => {
              const ungrouped: ReportDetailsColumnCard[] = []
              const grouped: Record<string, ReportDetailsColumnCard[]> = {}

              for (const card of column.cards) {
                if (card.groupLabel) {
                  if (!grouped[card.groupLabel]) grouped[card.groupLabel] = []
                  grouped[card.groupLabel].push(card)
                } else {
                  ungrouped.push(card)
                }
              }

              return (
                <View
                  key={column.settings.name}
                  style={STYLES.columnSection}
                  wrap={false}
                >
                  <View
                    style={[
                      STYLES.columnHeader,
                      { backgroundColor: column.styles.bgColor },
                    ]}
                  >
                    <Text style={STYLES.columnEmoji}>
                      {column.settings.emoji}
                    </Text>
                    <Text style={STYLES.columnName}>
                      {column.settings.name}
                    </Text>
                  </View>

                  {Object.entries(grouped).map(([label, cards]) => (
                    <View key={label}>
                      <View style={STYLES.groupHeader}>
                        <Text style={STYLES.groupLabel}>Group: {label}</Text>
                      </View>
                      {cards.map(card => (
                        <CardView
                          key={card.id}
                          card={card}
                          borderColor={column.styles.borderColor}
                        />
                      ))}
                    </View>
                  ))}

                  {ungrouped.map(card => (
                    <CardView
                      key={card.id}
                      card={card}
                      borderColor={column.styles.borderColor}
                    />
                  ))}
                </View>
              )
            })}
          </>
        )}

        {/* Footer */}
        <View style={STYLES.footer} fixed>
          <Text>Generated {format(new Date(), 'PPP')}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
