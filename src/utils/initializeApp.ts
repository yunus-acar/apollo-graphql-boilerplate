import { UserType, GenderType } from "../generated/typegql-prisma";
import DatabaseService from "../services/database.service";

async function initializeApp() {
  try {
    const userCount = await DatabaseService.client.user.count();

    if (userCount === 0) {
      await DatabaseService.client.user.create({
        data: {
          id: "1",
          name: "Yunus Emre",
          surname: "Acar",
          email: "me@yunusacar.dev",
          password: "deneme",
          userType: UserType.ADMIN,
          gender: GenderType.MALE,
        },
      });
      console.log("app initialized");
    }
  } catch (error) {
    console.log("initializeApp error :", error.message);
  }
}

export default initializeApp;
