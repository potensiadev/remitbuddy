// ❌ 기존 코드 (문제)
interface ProviderCardProps {
  provider: {
    name: string;
    receivedAmount: number;
    exchangeRate: number;
    fee: number;
    isRecommended?: boolean;
  };
}

// ✅ 수정된 코드 (해결)
interface ProviderCardProps {
  name: string;
  receivedAmount: number;
  exchangeRate: number;
  fee: number;
  isRecommended?: boolean;
}

// 컴포넌트 시그니처도 변경
const ProviderCard: React.FC<ProviderCardProps> = ({ 
  name,
  receivedAmount,
  exchangeRate,
  fee,
  isRecommended = false
}) => {
  // 이제 provider.name 대신 name 직접 사용
  return (
    <div className={/* ... */}>
      <h3>{name}</h3>
      <p>{receivedAmount}</p>
      {/* ... */}
    </div>
  );
};