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
  cardImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  cardImageFallback: {
    width: '100%',
    height: 170,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  cardDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  announcementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  announcementIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementTextContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  footerContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  outlinedButton: {
    height: 46,
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  outlinedButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
