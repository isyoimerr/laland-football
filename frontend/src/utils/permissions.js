const EDIT_ROLES = ['admin', 'super_admin', 'demo']
const DELETE_ROLES = ['super_admin', 'demo']
const SUPER_ADMIN_ROLES = ['super_admin', 'demo']

export const canEdit = (user) => EDIT_ROLES.includes(user?.role)
export const canDelete = (user) => DELETE_ROLES.includes(user?.role)
export const canManageLeagues = (user) => SUPER_ADMIN_ROLES.includes(user?.role)
