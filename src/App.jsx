import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import LayoutAdmin from "./component/LayoutAdmin";
import UserListPage from "./pages/admin/user/List";
import CreateUserPage from "./pages/admin/user/Create";
import UpdateUserPage from "./pages/admin/user/Update";
import CategoryListPage from "./pages/admin/category/List";
import CreateCategoryPage from "./pages/admin/category/Create";
import UpdateCategoryPage from "./pages/admin/category/Update";
import AccountListPage from "./pages/admin/accounts/List";
import CreateAccountPage from "./pages/admin/accounts/Create";
import UpdateAccountPage from "./pages/admin/accounts/Update";
import UpdateTransactionPage from "./pages/admin/transaction/Update";
import CreateTransactionPage from "./pages/admin/transaction/Create";
import TransactionList from "./pages/admin/transaction/List";
import UpdateGoalPage from "./pages/admin/goals/Update";
import CreateGoalPage from "./pages/admin/goals/Create";
import GoalListPage from "./pages/admin/goals/List";
import BudgetListPage from "./pages/admin/budgets/List";
import CreateBudgetPage from "./pages/admin/budgets/Create";
import UpdateBudgetPage from "./pages/admin/budgets/Update";

function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={
            <LayoutAdmin>
              <Home />
            </LayoutAdmin>
          } />
          <Route path="/admin/user" element={
            <LayoutAdmin>
              <UserListPage />
            </LayoutAdmin>
          } />
          <Route path="/admin/user/add" element={
            <LayoutAdmin>
              <CreateUserPage />
            </LayoutAdmin>
          } />

          <Route path="/admin/user/edit/:id" element={
            <LayoutAdmin>
              <UpdateUserPage />
            </LayoutAdmin>
          } />

          <Route path="/profile" element={
            <LayoutAdmin>
              <ProfilePage />
            </LayoutAdmin>
          } />

          <Route path="/admin/category" element={
            <LayoutAdmin>
              <CategoryListPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/category/add" element={
            <LayoutAdmin>
              <CreateCategoryPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/category/edit/:id" element={
            <LayoutAdmin>
              <UpdateCategoryPage />
            </LayoutAdmin>

          } />


          <Route path="/admin/account" element={
            <LayoutAdmin>
              <AccountListPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/account/add" element={
            <LayoutAdmin>
              <CreateAccountPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/account/edit/:id" element={
            <LayoutAdmin>
              <UpdateAccountPage />
            </LayoutAdmin>
          } />

          <Route path="/admin/transaction" element={
            <LayoutAdmin>
              <TransactionList />
            </LayoutAdmin>

          } />

          <Route path="/admin/transaction/add" element={
            <LayoutAdmin>
              <CreateTransactionPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/transaction/edit/:id" element={
            <LayoutAdmin>
              <UpdateTransactionPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/goal" element={
            <LayoutAdmin>
              <GoalListPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/goal/add" element={
            <LayoutAdmin>
              <CreateGoalPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/goal/edit/:id" element={
            <LayoutAdmin>
              <UpdateGoalPage />
            </LayoutAdmin>

          } />


          <Route path="/admin/budget" element={
            <LayoutAdmin>
              <BudgetListPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/budget/add" element={
            <LayoutAdmin>
              <CreateBudgetPage />
            </LayoutAdmin>

          } />

          <Route path="/admin/budget/edit/:id" element={
            <LayoutAdmin>
              <UpdateBudgetPage />
            </LayoutAdmin>

          } />
          <Route path="/" element={<LoginPage />} />

          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;