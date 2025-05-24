import { Databases, ID, Client, Query } from "appwrite";
import config from "./Config";

export class DatabasesService {
  client = new Client();
  databases;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.databases = new Databases(this.client);
  }
  async createUserDocument({ userId, name, email, role, businessName }) {
    try {
      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteUserCollectionId,
        ID.unique(),
        {
          userId,
          name,
          email,
          role,
          businessName,
          createdAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.log("appwrite service :: createUserDocument :: error ", error);
      throw error;
    }
  }
  async getUserByAppwriteId(userId) {
    try {
      const user = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteUserCollectionId,
        [Query.equal("userId", userId)]
      );
      return user.documents[0];
    } catch (error) {
      console.log("appwrite service :: userId :: error ", error);
      throw error.message;
    }
  }
}

const databasesService = new DatabasesService();
export default databasesService;
