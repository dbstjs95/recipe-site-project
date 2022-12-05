import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
import SignUpPage from "./page/SignUpPage";
import NotFoundPage from "./page/NotFoundPage";
import RecipeListPage from "./page/recipepage/RecipeListPage";
import ClassListPage from "./page/classPage/ClassListPage";
import EventPage from "./page/EventPage";
import RecipePage from "./page/recipepage/RecipePage";
import ClassPage from "./page/classPage/ClassPage";
import PurchasePage from "./page/PurchasePage";
import RegisterRecipePage from "./page/RegisterRecipePage";
import MyRecipePage from "./page/mypage/MyRecipePage";
import ModifyUserInfoPage from "./page/ModifyUserInfoPage";
import PurchasedClassPage from "./page/mypage/PurchasedClassPage";
import MyLikePage from "./page/mypage/MyLikePage";
import Profile from "./components/Profile";
import ModifyRecipePage from "./page/ModifyRecipePage";
import SimpleOuter from "./components/SimpleOuter";
import Auth from "./hoc/Auth";
import "./reset.css";

const AuthHomePage = Auth(HomePage, null);
const AuthRecipeListPage = Auth(RecipeListPage, null);
const AuthRecipePage = Auth(RecipePage, null);
const AuthClassListPage = Auth(ClassListPage, null);
const AuthClassPage = Auth(ClassPage, null);
const AuthPurchasePage = Auth(PurchasePage, true);
const AuthProfile = Auth(Profile, true);
const AuthRegisterRecipePage = Auth(RegisterRecipePage, true);
const AuthModifyRecipePage = Auth(ModifyRecipePage, true);
const AuthModifyUserInfoPage = Auth(ModifyUserInfoPage, true);

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<AuthHomePage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="recipes">
            <Route index element={<AuthRecipeListPage />} />
            <Route path=":recipeId" element={<AuthRecipePage />} />
          </Route>
          <Route path="classes">
            <Route index element={<AuthClassListPage />} />
            <Route path=":classId">
              <Route index element={<AuthClassPage />} />
              <Route path="pay" element={<AuthPurchasePage />} />
            </Route>
          </Route>
          <Route path="mypage" element={<AuthProfile />}>
            <Route path="recipe" element={<MyRecipePage />} />
            <Route path="like" element={<MyLikePage />} />
            <Route path="class" element={<PurchasedClassPage />} />
          </Route>
          <Route path="register/recipe" element={<AuthRegisterRecipePage />} />
          <Route path="modify/:recipeId" element={<AuthModifyRecipePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/user" element={<SimpleOuter />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="update" element={<AuthModifyUserInfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
