/**
 * 全局会员开通弹窗开关（与 default 布局中的 JKMembershipPayModal 联动）。
 */
export function useMembershipPaywall() {
  const open = useState('jk-membership-paywall', () => false)
  return { open }
}
