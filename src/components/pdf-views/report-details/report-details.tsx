'use client'

import { Document, Page, Text, View } from '@react-pdf/renderer'
import { format } from 'date-fns'
import { STYLES } from '../styles'
import type { ReportDetailsDocumentProps } from './types'

export function ReportDetailsDocument({
  title = 'Gr8 Retro Board Report',
  date = new Date(),
  stats,
  columns,
}: Readonly<ReportDetailsDocumentProps>) {
  return (
    <Document>
      <Page size='A4' style={STYLES.page}>
        {/* Header */}
        <View style={STYLES.header}>
          <Text style={STYLES.headerTitle}>{title}</Text>
          <View style={STYLES.headerMeta}>
            <Text style={STYLES.headerMetaItem}>{format(date, 'PPP')}</Text>
          </View>
        </View>

        {/* Summary Stats */}
        <View style={STYLES.statsContainer}>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalCards}</Text>
            <Text style={STYLES.statLabel}>Total Cards</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalVotes}</Text>
            <Text style={STYLES.statLabel}>Total Votes</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>{stats.totalActions}</Text>
            <Text style={STYLES.statLabel}>Action Items</Text>
          </View>
          <View style={STYLES.statBox}>
            <Text style={STYLES.statValue}>
              {stats.completedActions}/{stats.totalActions}
            </Text>
            <Text style={STYLES.statLabel}>Completed</Text>
          </View>
        </View>

        <Text style={STYLES.sectionTitle}>Details</Text>
        {columns.map(column => {
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
                <Text style={STYLES.columnEmoji}>{column.settings.emoji}</Text>
                <Text style={STYLES.columnName}>{column.settings.name}</Text>
              </View>

              {column.cards.map(card => (
                <View
                  key={card.id}
                  style={[
                    STYLES.card,
                    { borderLeftColor: column.styles.borderColor },
                  ]}
                  wrap={false}
                >
                  <Text style={STYLES.cardContent}>{card.title}</Text>
                  <Text style={STYLES.cardMeta}>
                    {card.votes} 👍 · {card.submittedBy}
                  </Text>

                  {card.actionItems.length > 0 &&
                    card.actionItems.map(item => (
                      <View key={item.id} style={STYLES.actionItem}>
                        <Text
                          style={[STYLES.checkmark, STYLES.checkbox]}
                          render={() => {
                            return item.completed ? 'X' : ''
                          }}
                        />
                        <Text style={[STYLES.actionItemText]}>
                          {item.content}
                        </Text>
                        {item.assignedTo && (
                          <Text style={STYLES.actionItemAssignee}>
                            — {item.assignedTo}
                          </Text>
                        )}
                      </View>
                    ))}
                </View>
              ))}
            </View>
          )
        })}

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
