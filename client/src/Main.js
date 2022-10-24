import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import HomePage from "./page/HomePage";
import LoginPage from "./page/LoginPage";
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
import SimpleOuter from "./components/SimpleOuter";
import "./reset.css";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="recipes">
            <Route index element={<RecipeListPage />} />
            <Route path=":recipeId" element={<RecipePage />} />
          </Route>
          <Route path="classes">
            <Route index element={<ClassListPage />} />
            <Route path=":classId" element={<ClassPage />} />
          </Route>
          <Route path="mypage" element={<Profile />}>
            <Route path="recipe" element={<MyRecipePage />} />
            <Route path="like" element={<MyLikePage />} />
            <Route path="class" element={<PurchasedClassPage />} />
          </Route>
          <Route path="pay" element={<PurchasePage />} />
          <Route path="register/recipe" element={<RegisterRecipePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/user" element={<SimpleOuter />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="update" element={<ModifyUserInfoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
