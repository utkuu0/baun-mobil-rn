import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  listContent: {
    padding: 12,
  },
  offlineNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(230, 81, 0, 0.08)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(230, 81, 0, 0.2)',
  },
  offlineText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 10,
    flex: 1,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadgeContainer: {
    marginRight: 12,
  },
  dateBadge: {
    width: 54,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  dateBadgeDay: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateBadgeMonth: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
  },
  textDetails: {
    flex: 1,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
    marginBottom: 6,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  iconRowText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  calendarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    padding: 14,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
  },
  calendarAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  calendarTextContainer: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  calendarSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  modalHeaderTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  modalPadding: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 26,
    marginVertical: 6,
  },
  modalDivider: {
    height: 1,
    marginVertical: 14,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoTextContainer: {
    marginLeft: 14,
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  descriptionContainer: {
    marginTop: 18,
  },
  descriptionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionBody: {
    fontSize: 14,
    lineHeight: 22,
  },
});
