import {Client, Databases, ID, Query} from 'appwrite'
import envconfig from '../envconfig/envconfig.js'
export class Service{
    client= new Client()
    databases;

    constructor(){
        this.client
            .setEndpoint(envconfig.appwriteURI)
            .setProject(envconfig.appwriteProjectId)
        this.databases=new Databases(this.client)
    }

    async createStudent(data){
        try {
            return await this.databases.createDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.students,
                ID.unique(),
                data
            )
        } catch (error) {
            console.log("Error while creating student: ",error);
            
        }
    }

    async getAllStudents(){
        try {
            return await this.databases.listDocuments(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.students
            )
        } catch (error) {
            console.log("Error while getting all students: ",error);   
        }
    }

    async createSubject(data){
        try {
            return await this.databases.createDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.subjects,
                ID.unique(),
                data
            )
        } catch (error) {
            console.log("Error while creating subjects: ",error);   
        }
    }

    async getAllSubjectsOfAStudent(studentId){
        try {
            return await this.databases.listDocuments(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.subjects,
                [
                    Query.equal('student_id', studentId)
                ]
            )
        } catch (error) {
            console.log("Error while getting all subjects: ",error);   
        }
    }

    async createAttendance(data){
        try {
            return await this.databases.createDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.attendance,
                ID.unique(),
                data
            )
        } catch (error) {
            console.log("Error while creating attendance: ",error);   
        }
    }

    async updateAttendance(documentId, updatedData){
        try {
            return await this.databases.updateDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.subjects,
                documentId,updatedData
            )
        } catch (error) {
            console.log("Error while updating attendance: ",error);   
        }
    }

    async updateAttendanceRecord(documentId, updatedData){
        try {
            return await this.databases.updateDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.attendance,
                documentId,updatedData
            )
        } catch (error) {
            console.log("Error while updating attendance: ",error);   
        }
    }


    async getStudentAttendance(studentId, subjectId){
        try {
            return await this.databases.listDocuments(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.attendance,
                [
                    
                    Query.equal('student_id',studentId),
                    Query.equal('subject_id',subjectId)
                    
                ]
            )
        } catch (error) {
            console.log("Error while getting attendance: ",error);   
        }
    
    }
    
    async deleteAttendance(id){
        try {
            return await this.databases.deleteDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.attendance,
                id
            )
        } catch (error) {
            console.log("Error while deleting attendance: ",error);   
        }
    }

    async deleteSubject(id){
        try {
            return await this.databases.deleteDocument(
                envconfig.appwriteDatabaseId,
                envconfig.appwriteCollections.subjects,
                id
            )
        } catch (error) {
            console.log("Error while deleting subjects: ",error);   
        }
    }
}

const service=new Service()
export default service