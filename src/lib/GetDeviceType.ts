export enum DeviceType {
  TABLET = 'tablet',
  MOBILE = 'mobile',
  DESKTOP = 'desktop'
}

export function GetDeviceType (): DeviceType {
  const ua = navigator.userAgent
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return DeviceType.TABLET
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return DeviceType.MOBILE
  }
  return DeviceType.DESKTOP
};
