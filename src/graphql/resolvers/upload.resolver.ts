import { GraphQLJSONObject } from "graphql-scalars";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Mutation, Resolver } from "type-graphql";
import { uploadGoogleStorageImage } from "../../utils/googleStorageFunctions";

@Resolver()
class UploadResolver {
  @Mutation(() => GraphQLJSONObject)
  async uploadFile(@Arg("file", () => GraphQLUpload) file: FileUpload) {
    console.log("geldi??");

    try {
      const result = await uploadGoogleStorageImage(file);
      return {
        file: result.fileName,
      };
    } catch (error) {
      console.log("uploadFile err ", error);
      throw error;
    }
  }
}

export default UploadResolver;
