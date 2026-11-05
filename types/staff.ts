/** Data staff yang dikirim GET /api/staff (publik): hanya kolom yang aman ditampilkan. */
export interface PublicStaffMember {
  _id: string
  name: string
  position: string
  mappiNumber: string
}

export interface PublicStaffGroup {
  branch: { _id: string; name: string; city: string }
  staff: PublicStaffMember[]
}
