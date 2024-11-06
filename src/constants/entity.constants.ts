export enum VerifyStatus {
  UNVERIFY = 'Chưa xác thực',
  PENDING = 'Chờ xác thực',
  SUCCESS = 'Thành công',
}

export enum CampaignStatus {
  FUNDING = 'Đang gây quỹ',
  COMPLETE = 'Đã hoàn thành',
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
  BANK_TRANSFER = 'bank transfer',
}

export enum PaymentStatus {
  PENDING = 'Đang chờ',
  SUCCESS = 'Thành công',
  FAILED = 'Thất bại',
}
