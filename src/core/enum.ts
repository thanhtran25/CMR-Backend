enum Roles { ADMIN = 'admin', MANAGER = 'manager', STAFF = 'staff', CUSTOMER = 'customer', SHIPPER = 'shipper' };
enum Gender { MALE = 'male', FEMALE = 'female', OTHER = 'other' };
enum BillStatus { UNPAID = 'unpaid', PAID = 'paid' };
enum TokenType { FORGOT_PASSWORD = 'forgot_password', SIGNUP = 'signup' };
enum OrderStates { WAITING = 'waiting', ACCEPTED = 'accepted', SHIPPING = 'shipping', DELIVERING = 'delivering', DELIVERED = 'delivered', CANCEL = 'cancel' }

export {
    Roles,
    Gender,
    BillStatus,
    OrderStates,
    TokenType
};