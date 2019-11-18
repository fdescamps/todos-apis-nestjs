export const loggerServiceMock = new (jest.fn(() => ({
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
})))();

export const configServiceMock = new (jest.fn(() => ({
  get: jest.fn(),
})))();

export const httpServiceMock = new (jest.fn(() => ({
  get: jest.fn(),
})))();

export const jwsServiceMock = new (jest.fn(() => ({
  verifySalesforceJwt: jest.fn(),
})))();

export const keyvaultServiceMock = new (jest.fn(() => ({
  getKeyVaultSecret: jest.fn(),
})))();

export const loggerUtilityMock = new (jest.fn(() => ({
  formatter: jest.fn(),
})))();
