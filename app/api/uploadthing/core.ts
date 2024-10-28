import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes

export const ourFileRouter = {
  image: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  studentImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  moduleImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  userImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  media: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .onUploadComplete(() => {}),
  video: f({ video: { maxFileSize: '4GB', maxFileCount: 1 } }) // New route for videos
    .onUploadComplete(() => {}),

    
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
