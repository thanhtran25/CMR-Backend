enum Roles { ADMIN = 'admin', MANAGER = 'manager', STAFF = 'staff', CUSTOMER = 'customer' };
enum Gender { MALE = 'male', FEMALE = 'female', OTHER = 'other' };
enum BillStatus { UNPAID = 'unpaid', PAID = 'paid' };
enum OrderStates { WAITING = 'waiting', SHIPPING = 'shipping', DELIVERING = 'delivering', DELIVERED = 'delivered', CANCEL = 'cancel' }

export {
    Roles,
    Gender,
    BillStatus,
    OrderStates
};