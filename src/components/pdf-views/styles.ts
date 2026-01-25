import { StyleSheet } from '@react-pdf/renderer'

export const STYLES = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },

  // Header
  header: {
    textAlign: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1f2937',
    paddingBottom: 16,
    marginBottom: 20,
  },
  headerSubtitle: {
    fontSize: 9,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  headerMetaItem: {
    fontSize: 10,
    color: '#4b5563',
  },

  // Summary Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 2,
  },

  // Category Breakdown
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  categoryBox: {
    flex: 1,
    borderRadius: 6,
    padding: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: 12,
  },
  categoryName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  categoryValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
  },
  categoryLabel: {
    fontSize: 8,
    color: '#4b5563',
  },

  // Column Sections
  columnSection: {
    marginBottom: 16,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
  },
  columnEmoji: {
    fontSize: 11,
  },
  columnName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
  },

  // Cards
  card: {
    borderLeftWidth: 2,
    paddingLeft: 10,
    paddingVertical: 4,
    marginBottom: 8,
    marginLeft: 4,
  },
  cardContent: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 8,
    color: '#6b7280',
    marginBottom: 4,
  },

  // Action Items
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 2,
    paddingLeft: 4,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#75777c',
    borderRadius: 2,
    marginRight: 6,
    marginTop: 1,
    display: 'flex',
    alignSelf: 'center',
    justifySelf: 'center',
    textAlign: 'center',
  },
  checkmark: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#000',
  },
  actionItemText: {
    flex: 1,
    fontSize: 9,
    color: '#4b5563',
  },
  actionItemTextDone: {
    textDecoration: 'line-through',
    color: '#9ca3af',
  },
  actionItemAssignee: {
    fontSize: 8,
    color: '#9ca3af',
    marginLeft: 8,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
  },
})
