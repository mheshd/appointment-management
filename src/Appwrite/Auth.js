import { Client, Account, ID } from "appwrite";
import config from "./Config";

export class Authservice {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(config.appWriteUrl)
      .setProject(config.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount(email, password, name) {
    try {
      // Verify parameters exist first
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
      const useraccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (useraccount) {
        return this.Login({ email, password });
      } else {
        return useraccount;
      }
    } catch (error) {
      throw error.message;
    }
  }

  async Login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      throw error.message;
    }
  }

  async getUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("appwrite service :: getcurrentuser :: error ", error);
    }
    return null;
  }

  async Logout() {
    try {
      return await this.account.deleteSession("current");
    } catch (error) {
      console.log("appwrite service :: logout :: error ", error);
    }
  }
}

const authservice = new Authservice();
export default authservice;
