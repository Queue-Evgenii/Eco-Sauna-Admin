import type { AxiosInstance } from "axios";
import { Api } from "../api";
import type { MediaFileEntity } from "@/core/types/models/entities/media-file.entity";

export class MediaApi extends Api {
    constructor(apiClient: AxiosInstance) {
        super(apiClient, "/media");
    }

    uploadFile = (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        return this.postRequest<MediaFileEntity, FormData>(
            `/upload`,
            formData,
        );
    };

    updateFile = (id: number, data: MediaFileEntity) => {
        return this.patchRequest<MediaFileEntity, MediaFileEntity>(
            `/${id}`,
            data,
        );
    };
}
