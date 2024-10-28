import xlsx, { IJsonSheet } from "json-as-xlsx";
import { PrismaClient } from "@prisma/client";

interface Student {
  [key: string]: any;
  name: string;
  email: string;
  emailVerified: boolean;
  contactNo: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  sysUser: {
    name: string;
  };
}

export async function downloadToExcel(prisma: PrismaClient) {
  



  let settings = {
    fileName: "BCCSI Files",
  };

}