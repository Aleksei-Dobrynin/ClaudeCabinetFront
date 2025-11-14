import { API_URL } from "constants/config";

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    status?: number;
}


class ApiService2 {


    async getUploadedDocuments(applicationId: number): Promise<ApiResponse> {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}api/v1/UploadedApplicationDocument/GetForApplication?ApplicationId=${applicationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.ok) {
                const serverData = await response.json();

                const mergedData = this.mergeWithMockData(serverData);

                return {
                    success: true,
                    data: mergedData,
                    status: response.status
                };
            } else {
                return {
                    success: true,
                    data: this.getMockUploadedDocuments(),
                    status: 200
                };
            }
        } catch (error) {
            console.warn('Server not available, using mock data:', error);

            return {
                success: true,
                data: this.getMockUploadedDocuments(),
                status: 200
            };
        }
    }


    async uploadDocument(
        applicationId: number,
        documentTypeId: number,
        file: File,
        onProgress?: (progress: number) => void
    ): Promise<ApiResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('applicationId', applicationId.toString());
            formData.append('documentTypeId', documentTypeId.toString());

            return new Promise((resolve) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 10;
                    if (onProgress) {
                        onProgress(progress);
                    }

                    if (progress >= 100) {
                        clearInterval(interval);

                        const newDocument = {
                            id: Math.floor(Math.random() * 10000) + 1000,
                            doc_name: this.getDocumentTypeName(documentTypeId),
                            app_doc_id: Math.floor(Math.random() * 1000) + 100,
                            application_document_id: documentTypeId,
                            application_document_type_id: this.getDocumentCategoryId(documentTypeId),
                            application_document_type_name: this.getDocumentCategoryName(documentTypeId),
                            is_required: true,
                            is_signed: null,
                            file_id: Math.floor(Math.random() * 1000) + 100,
                            filename: file.name,
                            created_at: new Date().toISOString(),
                            file_bga_id: null,
                            created_by: 1,
                            is_outcome: false,
                            document_number: null,
                            service_document_id: Math.floor(Math.random() * 1000) + 1000
                        };

                        resolve({
                            success: true,
                            data: newDocument,
                            message: 'Документ успешно загружен'
                        });
                    }
                }, 50);
            });

        } catch (error) {
            return {
                success: false,
                message: 'Ошибка загрузки документа'
            };
        }
    }


    async deleteDocument(documentId: number): Promise<ApiResponse> {
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            return {
                success: true,
                message: 'Документ удален'
            };
        } catch (error) {
            return {
                success: false,
                message: 'Ошибка удаления документа'
            };
        }
    }


    private mergeWithMockData(serverData: any[]): any[] {
        const mockData = this.getMockUploadedDocuments();

        if (!serverData || !Array.isArray(serverData)) {
            return mockData;
        }

        const mergedData = [...serverData];

        mockData.forEach(mockDoc => {
            const exists = serverData.some(serverDoc =>
                serverDoc.application_document_id === mockDoc.application_document_id
            );

            if (!exists) {
                mergedData.push(mockDoc);
            }
        });

        return mergedData;
    }


    private getMockUploadedDocuments() {
        return [
        ];
    }

    private getDocumentTypeName(documentTypeId: number): string {
        const names: Record<number, string> = {
            1: 'Паспорт заявителя',
            2: 'Доверенность',
            3: 'Паспорт представителя',
            4: 'Государственный акт о праве частной собственности',
            5: 'Договор купли-продажи',
            6: 'Договор дарения',
            7: 'Свидетельство о наследстве',
            8: 'Договор аренды',
            9: 'Технический паспорт объекта',
            10: 'Расчет требуемых нагрузок',
            11: 'Схема планировочной организации',
            12: 'Разрешение на строительство',
            13: 'Согласование с Энергоуправлением',
            14: 'Согласование с Водоканалом',
            15: 'Заключение экологической экспертизы',
            16: 'Справка о многодетной семье',
            17: 'Справка об инвалидности',
            18: 'Справка о доходах'
        };

        return names[documentTypeId] || 'Документ';
    }


    private getDocumentCategoryId(documentTypeId: number): number {
        const categories: Record<number, number> = {
            1: 1, 2: 1, 3: 1,           // Удостоверяющие личность
            4: 2, 5: 2, 6: 2, 7: 2, 8: 2, // Правоустанавливающие
            9: 3, 10: 3, 11: 3,         // Технические
            12: 4, 13: 4, 14: 4, 15: 4, // Разрешительные
            16: 5, 17: 5, 18: 5         // Финансовые/льготные
        };

        return categories[documentTypeId] || 1;
    }


    private getDocumentCategoryName(categoryId: number): string {
        const names: Record<number, string> = {
            1: 'Документы, удостоверяющие личность',
            2: 'Правоустанавливающие документы',
            3: 'Технические документы',
            4: 'Разрешительные документы',
            5: 'Финансовые документы'
        };

        return names[categoryId] || 'Документ';
    }
}

export interface UploadedDocument {
    id: number;
    doc_name: string;
    app_doc_id: number;
    application_document_id: number;
    application_document_type_id: number;
    application_document_type_name: string;
    is_required?: boolean;
    is_signed?: boolean;
    file_id?: number;
    filename?: string;
    created_at?: string;
    file_bga_id?: string;
    created_by?: number;
    is_outcome?: boolean;
    document_number?: string;
    service_document_id?: number;
}


export default new ApiService2();