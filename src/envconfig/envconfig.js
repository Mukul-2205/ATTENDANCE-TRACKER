const envconfig={
    appwriteURI: String(import.meta.env.VITE_APPWRITE_URI),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteCollections:{

        students: String(import.meta.env.VITE_APPWRITE_STUDENTS_ID),
        subjects: String(import.meta.env.VITE_APPWRITE_SUBJECTS_ID),
        attendance: String(import.meta.env.VITE_APPWRITE_ATTENDANCE_ID)
        
    }
    
}

export default envconfig