enum Roles { ADMIN = 'admin', MANAGER = 'manager', STAFF = 'staff', CUSTOMER = 'customer' };
enum Gender { MALE = 'male', FEMALE = 'female', OTHER = 'other' };
enum BillStatus { UNPAID = 'unpaid', PAID = 'paid' };
enum OrderStates { WAITING = 'watting', SHIPPING = 'shipping', DELIVERING = 'delivering', DELIVERED = 'delivered' }

export {
    Roles,
    Gender,
    BillStatus,
    OrderStates
};