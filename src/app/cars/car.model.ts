export interface Car {
  _id: string,
  make: string,
  type: string,
  price: number,
  rentPerDay: number,
  productionYear: number,
  createdAt: Date | string,
  updatedAt: Date | string,
  isAvailable: boolean
}
