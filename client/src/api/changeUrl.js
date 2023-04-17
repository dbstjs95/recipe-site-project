import { bucketUrl } from "./fileUpload";
import userImg from "../assets/logo_img/user.png";
import { useCallback } from "react";

export const PROFILE_IMG_FIRST = "upload/user/";

export function useChangeUrl() {
  const changeUrl = useCallback(
    (url = "") => {
      return url?.startsWith(PROFILE_IMG_FIRST)
        ? `${bucketUrl}${url}`
        : url || userImg;
    },
    [bucketUrl, PROFILE_IMG_FIRST, userImg]
  );

  return changeUrl;
}
