use std::sync::Arc;

use super::{ConnectionPool, Hashing, JwtConfig};
use crate::repository::{UserRepository, AccountRepository, CategoryRepository, TransactionRepository, BudgetRepository, GoalRepository};
use crate::service::{AuthService, UserService, AccountService, CategoryService, TransactionService, BudgetService, GoalService};

use crate::abstract_trait::{DynAuthService, DynUserRepository, DynUserService, DynAccountRepository, DynAccountService, DynCategoryService, DynCategoryRepository, DynTransactionRepository, DynTransactionService, DynBudgetService, DynBudgetRepository, DynGoalRepository, DynGoalService};

#[derive(Clone)]
pub struct AppState {
    pub auth_service: DynAuthService,
    pub user_service: DynUserService,
    pub account_service: DynAccountService,
    pub category_service: DynCategoryService,
    pub transaction_service:  DynTransactionService,
    pub budget_service: DynBudgetService,
    pub goal_service: DynGoalService,
    pub jwt_config: JwtConfig
}

impl AppState {
    pub fn new(pool: ConnectionPool) -> Self {
        let hash = Hashing::new();

        let user_repository = Arc::new(UserRepository::new(pool.clone())) as DynUserRepository;
        let user_service =
            Arc::new(UserService::new(user_repository.clone(), hash.clone())) as DynUserService;
        let jwt_config = JwtConfig::new();

        let auth_service = Arc::new(AuthService::new(user_repository.clone(), hash.clone(), jwt_config.clone()));
        

        let account_repository = Arc::new(AccountRepository::new(pool.clone())) as DynAccountRepository;
        let account_service  = Arc::new(AccountService::new(account_repository.clone())) as DynAccountService;

        let category_repository = Arc::new(CategoryRepository::new(pool.clone())) as DynCategoryRepository;
        let category_service = Arc::new(CategoryService::new(category_repository)) as DynCategoryService;

        let transaction_repository = Arc::new(TransactionRepository::new(pool.clone())) as DynTransactionRepository;
        let transaction_service = Arc::new(TransactionService::new(transaction_repository)) as DynTransactionService;

        let budget_repository = Arc::new(BudgetRepository::new(pool.clone())) as DynBudgetRepository;
        let budget_service = Arc::new(BudgetService::new(budget_repository)) as DynBudgetService;

        let goal_repository = Arc::new(GoalRepository::new(pool.clone())) as DynGoalRepository;
        let goal_service = Arc::new(GoalService::new(goal_repository)) as DynGoalService;

        

        Self {
            auth_service,
            user_service,
            account_service,
            category_service,
            transaction_service,
            budget_service,
            goal_service,
            jwt_config,
        }
    }
}
