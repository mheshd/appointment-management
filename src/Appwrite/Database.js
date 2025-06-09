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
  // USER COLLECTION METHODS
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
  // AVAILABLE SLOTS COLLECTION METHODS

  //  List all slots for a given businessId
  async listAvailableSlots(businessId) {
    try {
      const response = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteAvailableSlots,
        [Query.equal("businessId", businessId)]
      );
      return response.documents;
    } catch (error) {
      console.log("listAvailableSlots error:", error);
      throw error;
    }
  }
  // Create a new slot (initially not booked)

  async createSlot(businessId, dateTime) {
    try {
      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteAvailableSlots,
        ID.unique(),
        {
          businessId,
          dateTime,
          isBooked: false,
        }
      );
    } catch (error) {
      console.log("createSlot error:", error);
      throw error;
    }
  }

  async deleteSlot(slotId) {
    try {
      return await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteAvailableSlots,
        slotId
      );
    } catch (error) {
      console.log("deleteSlot error:", error);
      throw error;
    }
  }

  // Mark a slot as booked (set isBooked = true)

  async bookSlot(slotId) {
    try {
      return await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteAvailableSlots,
        slotId,
        {
          isBooked: true,
        }
      );
    } catch (error) {
      console.log("bookSlot error:", error);
      throw error;
    }
  }

  // APPOINTMENTS COLLECTION METHODS

  // Create a new appointment
  async createAppointment({
    customerId,
    customerName,
    customerEmail,
    businessId,
    dateTime,
    purpose,
    status,
    createdAt,
  }) {
    try {
      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteAppointmentsCollectionId,
        ID.unique(),
        {
          customerId,
          customerName,
          customerEmail,
          businessId,
          dateTime,
          purpose,
          status,
          createdAt: createdAt || new Date().toISOString(),
        }
      );
    } catch (error) {
      console.log("createAppointment error:", error);
      throw error;
    }
  }

  //  List all appointments for a given customer
  async listAppointmentsByCustomer(customerId) {
    try {
      const response = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteAppointmentsCollectionId,
        [Query.equal("customerId", customerId)]
      );
      return response.documents;
    } catch (error) {
      console.log("listAppointmentsByCustomer error:", error);
      throw error;
    }
  }

  // 3.3 List all appointments for a given business
  async listAppointmentsByBusiness(businessId) {
    try {
      const response = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteAppointmentsCollectionId,
        [Query.equal("businessId", businessId)]
      );
      return response.documents;
    } catch (error) {
      console.log("listAppointmentsByBusiness error:", error.message);
      throw error;
    }
  }

  // Update only the status (and updatedAt) of an appointment
  async updateAppointmentStatus(appointmentId, newStatus) {
    try {
      return await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteAppointmentsCollectionId,
        appointmentId,
        {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
      );
    } catch (error) {
      console.log("updateAppointmentStatus error:", error);
      throw error;
    }
  }

  // list bussiness user
  async listBusinessUsers() {
    try {
      const response = await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteUserCollectionId,
        [Query.equal("role", "business")]
      );
      return response.documents;
    } catch (error) {
      console.log("listBusinessUsers error:", error);
      throw error;
    }
  }

  async updateAppointmentDate(appointmentId, newDateTime) {
    try {
      return await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteAppointmentsCollectionId,
        appointmentId,
        { dateTime: newDateTime, updatedAt: new Date().toISOString() }
      );
    } catch (error) {
      console.log("updateAppointmentDate error:", error);
      throw error;
    }
  }
}

const databasesService = new DatabasesService();
export default databasesService;
