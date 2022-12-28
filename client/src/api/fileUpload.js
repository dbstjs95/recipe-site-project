import AWS from "aws-sdk";
import { v4 } from "uuid";

const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.REACT_APP_SECRET_ACCESS_KEY;
const REGION = process.env.REACT_APP_REGION;
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;

export const bucketUrl = process.env.REACT_APP_BUCKET_URL;

export const FileFirst = "upload/recipe/";

AWS.config.update({
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
  apiVersion: "2006-03-01",
});

//링크 참고: https://codegear.tistory.com/8
export function fileUpload(file, folderName) {
  if (file) {
    const fileName = `${folderName || FileFirst}${v4()
      .toString()
      .replaceAll("-", "")}.${file.type.split("/")[1]}`;

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: S3_BUCKET, // 버킷 이름
        Key: fileName,
        Body: file, // 파일 객체
      },
    });

    const promise = upload.promise();
    return promise.then(
      function (data) {
        return fileName;
      },
      function (err) {
        return null;
      }
    );
  }
  return "";
}

//파일 리스트 삭제: Objects:  [{ Key: '' }, { Key: '' }, { Key: '' }]
export function fileDelete(list) {
  const s3 = new AWS.S3();

  const params = {
    Bucket: S3_BUCKET,
    Delete: {
      Objects: list,
      Quiet: false,
    },
  };

  return s3.deleteObjects(params, function (err, data) {
    if (err) {
      console.error(err);
    } // an error occurred
    else {
      console.log(data);
    } // successful response
  });
}

//특정 폴더내의 모든 파일 삭제
// export function directoryDelete(dirName) {
//   const s3 = new AWS.S3({
//     apiVersion: "2006-03-01",
//     params: { Bucket: S3_BUCKET },
//   });

//   s3.listObjects({ Prefix: dirName }, function (err, data) {
//     if (err) {
//       return alert("There was an error deleting your album: ", err.message);
//     }

//     let objects = data.Contents.map(function (object) {
//       return { Key: object.Key };
//     });

//     s3.deleteObjects(
//       {
//         Delete: { Objects: objects, Quiet: true },
//       },
//       function (err, data) {
//         if (err) {
//           console.error(err);
//           return null;
//         }

//         if (data) {
//           return data;
//         }
//       }
//     );
//   });
// }
