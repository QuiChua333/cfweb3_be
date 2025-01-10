export enum VerifyStatus {
  UNVERIFY = 'Chưa xác thực',
  PENDING = 'Chờ xác thực',
  SUCCESS = 'Đã xác thực',
}

export enum UserStatus {
  INACTIVATE = 'Tạm khóa',
  ACTIVATE = 'Đang hoạt động',
}

export enum CampaignStatus {
  FUNDING = 'Đang gây quỹ',
  SUCCESS = 'Thành công',
  PENDING = 'Chờ xác nhận',
  TERMINATE = 'Tạm dừng',
  FAILED = 'Thất bại',
  DRAFT = 'Bản nháp',
}

export enum ConfirmMemberStatus {
  PENDING = 'Chờ xác nhận',
  ACCEPTED = 'Đã xác nhận',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  MOMO = 'momo',
  CRYPTO = 'crypto',
}

export enum PaymentStatus {
  PENDING = 'Đang chờ',
  SUCCESS = 'Thành công',
  FAILED = 'Thất bại',
}

export enum ReportStatus {
  NO_RESPONSE = 'Chưa phản hồi',
  RESPONSE = 'Đã phản hồi',
}

export enum CryptoCurrency {
  ETH = 'ETH',
}
