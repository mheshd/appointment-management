const config = {
  appWriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
  appWriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appWriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appWriteUserCollectionId: String(
    import.meta.env.VITE_APPWRITE_USER_COLLECTIONID_ID
  ),
  appWriteAppointmentsCollectionId: String(
    import.meta.env.VITE_APPWRITE_APPOINTMENTS_ID
  ),
  appWriteAvailableSlots: String(import.meta.env.VITE_APPWRITE_AVIABLESLOT_ID),
};
export default config;
