export interface ValidationError {
  errors: Record<string, unknown[]>
}


export interface MaterialAssignment {
  id: number;
  encoder_user_id: number;
  publisher_user_id: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface CreateEditProps {
  id: number,
  auth: AuthProps,
  material: Material,
  ckLicense: string,
  //categories: Category[],
  authors: AuthorApi,
  agencies: Agency[],
  regions: Region[],
  //regionalOffices: RegionalOffice[],
  tags: string[],
  uri: string
}
