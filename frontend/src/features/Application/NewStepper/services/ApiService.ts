// services/ApiService.ts

export type Service = {
  id: number;
  name: string;
  name_kg?: string;
  name_long?: string;
  name_long_kg?: string;
  name_statement?: string;
  name_statement_kg?: string;
  name_confirmation?: string;
  name_confirmation_kg?: string;
  short_name: string;
  code: string;
  description: string;
  day_count: number;
  workflow_id: number;
  workflow_name?: string;
  price: number;
};

export interface ObjectTag {
  id: number;
  name: string;
  code: string;
}


export interface ApplicationData {
  id: number;
  serviceId: number | null;
  workType: string;
  objects: any[];
  applicant: ParticipantData | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParticipantData {
  inn: string;
  name: string;
  type: 'individual' | 'legal';
  phone: string;
  email: string;
  address: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}


class ApiService {
  private baseUrl = process.env.REACT_APP_API_URL || '/api';
  
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Services API
  async getDocumentTypes(): Promise<ApiResponse<DocumentType[]>> {
    await this.delay(500);
    
    // return await fetch(`${this.baseUrl}/services`).then(r => r.json());
    
    return {
      success: true,
      data: [
        // { id: 1, name: 'Архитектурно-планировочное задание', code: 'APZ' },
        // { id: 2, name: 'Эскизный проект', code: 'EP' },
        // { id: 3, name: 'Паспорт фасада', code: 'PF' },
        // { id: 4, name: 'Разрешение на строительство', code: 'RS' },
        // { id: 5, name: 'Ввод в эксплуатацию', code: 'VE' },
        // { id: 6, name: 'Градостроительные условия', code: 'GU' },
        // { id: 7, name: 'Согласование перепланировки', code: 'SP' }
      ]
    };
  }
  // Services API
  async uploadDocument(file, id): Promise<ApiResponse<DocumentType[]>> {
    await this.delay(500);
    
    // return await fetch(`${this.baseUrl}/services`).then(r => r.json());
    
    return {
      success: true,
      data: [
        // { id: 1, name: 'Архитектурно-планировочное задание', code: 'APZ' },
        // { id: 2, name: 'Эскизный проект', code: 'EP' },
        // { id: 3, name: 'Паспорт фасада', code: 'PF' },
        // { id: 4, name: 'Разрешение на строительство', code: 'RS' },
        // { id: 5, name: 'Ввод в эксплуатацию', code: 'VE' },
        // { id: 6, name: 'Градостроительные условия', code: 'GU' },
        // { id: 7, name: 'Согласование перепланировки', code: 'SP' }
      ]
    };
  }
  
  
  // Tags API
  async saveParticipant(data): Promise<ApiResponse<ObjectTag[]>> {
    await this.delay(300);
    
    // return await fetch(`${this.baseUrl}/object-tags`).then(r => r.json());
    
    return {
      success: true,
      data: [
        { id: 1, name: 'Жилое помещение', code: 'residential' },
        { id: 2, name: 'Коммерческая недвижимость', code: 'commercial' },
        { id: 3, name: 'Офисное помещение', code: 'office' },
        { id: 4, name: 'Производственное помещение', code: 'industrial' },
        { id: 5, name: 'Многоквартирный дом', code: 'apartment' },
        { id: 6, name: 'Частный дом', code: 'house' },
        { id: 7, name: 'Земельный участок', code: 'land' },
        { id: 8, name: 'Временное сооружение', code: 'temporary' },
        { id: 9, name: 'Объект культурного наследия', code: 'heritage' },
        { id: 10, name: 'Реконструкция', code: 'reconstruction' }
      ]
    };
  }
  // Tags API
  async getObjectTags(): Promise<ApiResponse<ObjectTag[]>> {
    await this.delay(300);
    
    // return await fetch(`${this.baseUrl}/object-tags`).then(r => r.json());
    
    return {
      success: true,
      data: [
        { id: 1, name: 'Жилое помещение', code: 'residential' },
        { id: 2, name: 'Коммерческая недвижимость', code: 'commercial' },
        { id: 3, name: 'Офисное помещение', code: 'office' },
        { id: 4, name: 'Производственное помещение', code: 'industrial' },
        { id: 5, name: 'Многоквартирный дом', code: 'apartment' },
        { id: 6, name: 'Частный дом', code: 'house' },
        { id: 7, name: 'Земельный участок', code: 'land' },
        { id: 8, name: 'Временное сооружение', code: 'temporary' },
        { id: 9, name: 'Объект культурного наследия', code: 'heritage' },
        { id: 10, name: 'Реконструкция', code: 'reconstruction' }
      ]
    };
  }
  
  // Application API
  async getApplication(id: number): Promise<ApiResponse<ApplicationData>> {
    await this.delay(1000);
    
    // return await fetch(`${this.baseUrl}/applications/${id}`).then(r => r.json());
    
    // Mock data
    if (id === 123) { // Тестовый ID для демонстрации
      return {
        success: true,
        data: {
          id: 123,
          serviceId: 1,
          workType: 'Строительство жилого дома',
          objects: [
            {
              id: 'obj-1',
              pin: '1-01-09-0064-0054',
              hasPin: true,
              district: 'leninsky',
              street: 'ул. Киевская',
              houseNumber: '114',
              apartmentNumber: '',
              tags: [
                { id: 1, name: 'Жилое помещение', code: 'residential' },
                { id: 6, name: 'Частный дом', code: 'house' }
              ]
            }
          ],
          applicant: {
            inn: '12345678901234',
            name: 'Иванов Иван Иванович',
            type: 'individual',
            phone: '+996 700 123 456',
            email: 'ivanov@example.com',
            address: 'г. Бишкек, ул. Киевская, 114'
          },
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
    }
    
    return { success: false, message: 'Заявка не найдена' };
  }
  
  async generatePrintDocuments(id): Promise<ApiResponse<ApplicationData>> {
    await this.delay(1000);
    
    // return await fetch(`${this.baseUrl}/applications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(r => r.json());
    
    const newId = Math.floor(Math.random() * 1000) + 1;
    return {
      success: true,
      // data: {
      //   ...data,
      //   id: newId,
      //   status: 'draft',
      //   createdAt: new Date().toISOString(),
      //   updatedAt: new Date().toISOString()
      // } as ApplicationData
    };
  }
  
  async createApplication(data: Partial<ApplicationData>): Promise<ApiResponse<ApplicationData>> {
    await this.delay(1000);
    
    // return await fetch(`${this.baseUrl}/applications`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(r => r.json());
    
    const newId = Math.floor(Math.random() * 1000) + 1;
    return {
      success: true,
      data: {
        ...data,
        id: newId,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as ApplicationData
    };
  }
  
  async updateApplication(id: number, data: Partial<ApplicationData>): Promise<ApiResponse<ApplicationData>> {
    await this.delay(800);
    
    // return await fetch(`${this.baseUrl}/applications/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // }).then(r => r.json());
    
    return {
      success: true,
      data: {
        ...data,
        id,
        updatedAt: new Date().toISOString()
      } as ApplicationData
    };
  }
  
  async getDistricts(): Promise<ApiResponse<Array<{ id: string; name: string }>>> {
    await this.delay(500);
    
    // return await fetch(`${this.baseUrl}/districts`).then(r => r.json());
    
    return {
      success: true,
      data: [
        { id: 'leninsky', name: 'Ленинский' },
        { id: 'sverdlovsky', name: 'Свердловский' },
        { id: 'oktyabrsky', name: 'Октябрьский' },
        { id: 'pervomaysky', name: 'Первомайский' }
      ]
    };
  }
  
  async searchStreets(query: string): Promise<ApiResponse<string[]>> {
    await this.delay(500);
    
    // return await fetch(`${this.baseUrl}/streets/search?q=${encodeURIComponent(query)}`)
    //   .then(r => r.json());
    
    const streets = [
      'ул. Киевская',
      'ул. Московская',
      'пр. Чуй',
      'пр. Манаса',
      'ул. Токтогула',
      'ул. Исанова',
      'ул. Советская',
      'ул. Боконбаева',
      'ул. Жибек-Жолу',
      'ул. Абдрахманова'
    ];
    
    return {
      success: true,
      data: streets.filter(s => s.toLowerCase().includes(query.toLowerCase()))
    };
  }
  
  // Participants API
  async searchByInn(inn: string): Promise<ApiResponse<ParticipantData>> {
    await this.delay(1000);
    
    // return await fetch(`${this.baseUrl}/participants/search?inn=${inn}`)
    //   .then(r => r.json());
    
    // Mock data
    if (inn === '12345678901234') {
      return {
        success: true,
        data: {
          inn: inn,
          name: 'Иванов Иван Иванович',
          type: 'individual',
          phone: '+996 700 123 456',
          email: 'ivanov@example.com',
          address: 'г. Бишкек, ул. Киевская, 114'
        }
      };
    }
    return { success: false, message: 'Участник не найден' };
  }







  async getUploadedDocuments(applicationId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/v1/UploadedApplicationDocument/GetForApplication?ApplicationId=${applicationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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


  // async uploadDocument(
  //   applicationId: number, 
  //   documentTypeId: number, 
  //   file: File,
  //   onProgress?: (progress: number) => void
  // ): Promise<ApiResponse> {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('applicationId', applicationId.toString());
  //     formData.append('documentTypeId', documentTypeId.toString());

  //     return new Promise((resolve) => {
  //       let progress = 0;
  //       const interval = setInterval(() => {
  //         progress += 10;
  //         if (onProgress) {
  //           onProgress(progress);
  //         }
          
  //         if (progress >= 100) {
  //           clearInterval(interval);
            
  //           const newDocument = {
  //             id: Math.floor(Math.random() * 10000) + 1000,
  //             doc_name: this.getDocumentTypeName(documentTypeId),
  //             app_doc_id: Math.floor(Math.random() * 1000) + 100,
  //             application_document_id: documentTypeId,
  //             application_document_type_id: this.getDocumentCategoryId(documentTypeId),
  //             application_document_type_name: this.getDocumentCategoryName(documentTypeId),
  //             is_required: true,
  //             is_signed: null,
  //             file_id: Math.floor(Math.random() * 1000) + 100,
  //             filename: file.name,
  //             created_at: new Date().toISOString(),
  //             file_bga_id: null,
  //             created_by: 1,
  //             is_outcome: false,
  //             document_number: null,
  //             service_document_id: Math.floor(Math.random() * 1000) + 1000
  //           };

  //           resolve({
  //             success: true,
  //             data: newDocument,
  //             message: 'Документ успешно загружен'
  //           });
  //         }
  //       }, 200);
  //     });

  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: 'Ошибка загрузки документа'
  //     };
  //   }
  // }


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
      {
        "id": 1734,
        "doc_name": "Государственный акт о праве частной собственности",
        "app_doc_id": 427,
        "application_document_id": 13,
        "application_document_type_id": 1,
        "application_document_type_name": "Правоустанавливающий документ",
        "is_required": true,
        "is_signed": null,
        "type_name": null,
        "upload_id": null,
        "upload_name": null,
        "created_at": "2025-06-26T18:01:58.78246",
        "file_id": 445,
        "file_bga_id": null,
        "filename": "Охват услуг ИТУ.pdf",
        "created_by": null,
        "is_outcome": null,
        "document_number": null,
        "service_document_id": 1734
      }
    ];
  }


  private getDocumentTypeName(documentTypeId: number): string {
    const names: Record<number, string> = {
      13: 'Государственный акт о праве частной собственности',
      16: 'Договор (купли-продажи, дарения, мены, приватизации, свидетельство о наследстве по Закону)',
      26: 'Расчет требуемых нагрузок на инженерные сети',
      145: 'Свидетельство',
      155: 'Доверенность',
      156: 'Договор'
    };
    
    return names[documentTypeId] || 'Документ';
  }


  private getDocumentCategoryId(documentTypeId: number): number {
    const categories: Record<number, number> = {
      13: 1, // Правоустанавливающий
      16: 1, // Правоустанавливающий
      26: 2, // Технический
      145: 3, // Разрешительный
      155: 4, // Удостоверяющий личность
      156: 4  // Удостоверяющий личность
    };
    
    return categories[documentTypeId] || 1;
  }


  private getDocumentCategoryName(categoryId: number): string {
    const names: Record<number, string> = {
      1: 'Правоустанавливающий документ',
      2: 'Технический документ',
      3: 'Разрешительный документ',
      4: 'Документ, удостоверяющий личность'
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

export default new ApiService();