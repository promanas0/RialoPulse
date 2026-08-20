import { toast } from 'sonner';
import { ExternalLink, CheckCircle2, AlertCircle, Loader2, Info } from 'lucide-react';

export const RIALO_EXPLORER_BASE_URL = 'https://explorer.rialo.io';

export const getExplorerTxUrl = (txHash: string) => {
  return `${RIALO_EXPLORER_BASE_URL}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string) => {
  return `${RIALO_EXPLORER_BASE_URL}/address/${address}`;
};

export const showTxPending = (title: string, description?: string, txHash?: string) => {
  return toast.custom(() => (
    <div className="bg-[#FAF6EA] border-2 border-[#1C1C1A] text-[#1C1C1A] p-4 shadow-xl font-mono text-xs w-full max-w-sm flex items-start space-x-3">
      <Loader2 className="w-5 h-5 text-[#C85A27] animate-spin shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#1C1C1A] flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[10px] uppercase tracking-wider bg-[#C85A27]/10 text-[#C85A27] px-1.5 py-0.5 font-semibold">
            Pending
          </span>
        </div>
        {description && <p className="text-[#5C584E] mt-1 text-[11px] leading-relaxed">{description}</p>}
        {txHash && (
          <div className="mt-2 pt-2 border-t border-[#D9D2C1] flex items-center justify-between">
            <span className="text-[#8C8678] text-[10px] truncate max-w-[160px]">{txHash}</span>
            <a
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noreferrer"
              className="text-[#C85A27] hover:underline flex items-center space-x-1 text-[11px] font-semibold"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  ), { duration: 10000 });
};

export const showTxSuccess = (
  title: string,
  txHash?: string,
  description: string = 'Transaction confirmed on Rialo 50ms consensus block.'
) => {
  return toast.custom(() => (
    <div className="bg-[#FAF6EA] border-2 border-[#2E7D52] text-[#1C1C1A] p-4 shadow-xl font-mono text-xs w-full max-w-sm flex items-start space-x-3">
      <CheckCircle2 className="w-5 h-5 text-[#2E7D52] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#1C1C1A] flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[10px] uppercase tracking-wider bg-[#2E7D52]/10 text-[#2E7D52] px-1.5 py-0.5 font-semibold">
            Confirmed ✅
          </span>
        </div>
        {description && <p className="text-[#5C584E] mt-1 text-[11px] leading-relaxed">{description}</p>}
        {txHash && (
          <div className="mt-2.5 pt-2 border-t border-[#D9D2C1] flex items-center justify-between">
            <span className="text-[#8C8678] text-[10px] truncate max-w-[150px]">{txHash}</span>
            <a
              href={getExplorerTxUrl(txHash)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 bg-[#1C1C1A] text-[#FAF6EA] hover:bg-[#C85A27] px-2 py-1 text-[10px] uppercase tracking-wider font-bold transition-colors"
            >
              <span>View on Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  ), { duration: 6000 });
};

export const showTxError = (title: string, error?: string | Error) => {
  const errorMsg = typeof error === 'string' ? error : error?.message || 'Transaction failed or rejected.';
  return toast.custom(() => (
    <div className="bg-[#FAF6EA] border-2 border-[#C43D3D] text-[#1C1C1A] p-4 shadow-xl font-mono text-xs w-full max-w-sm flex items-start space-x-3">
      <AlertCircle className="w-5 h-5 text-[#C43D3D] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#C43D3D] flex items-center justify-between">
          <span>{title}</span>
          <span className="text-[10px] uppercase tracking-wider bg-[#C43D3D]/10 text-[#C43D3D] px-1.5 py-0.5 font-semibold">
            Failed ❌
          </span>
        </div>
        <p className="text-[#5C584E] mt-1 text-[11px] leading-relaxed break-words">{errorMsg}</p>
      </div>
    </div>
  ), { duration: 6000 });
};

export const showTxInfo = (title: string, description?: string) => {
  return toast.custom(() => (
    <div className="bg-[#FAF6EA] border-2 border-[#1C1C1A] text-[#1C1C1A] p-4 shadow-xl font-mono text-xs w-full max-w-sm flex items-start space-x-3">
      <Info className="w-5 h-5 text-[#C85A27] shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-sm text-[#1C1C1A]">{title}</div>
        {description && <p className="text-[#5C584E] mt-1 text-[11px] leading-relaxed">{description}</p>}
      </div>
    </div>
  ), { duration: 4000 });
};

/**
 * Executes an async transaction with full toast lifecycle: Pending -> Confirmed ✅ (with Explorer Link) or Failed ❌
 */
export const trackTxPromise = async <T,>(
  promise: Promise<T>,
  options: {
    loadingTitle: string;
    loadingDescription?: string;
    successTitle: string;
    successDescription?: string;
    errorTitle: string;
    getTxHash?: (result: T) => string | undefined;
  }
): Promise<T> => {
  const toastId = showTxPending(options.loadingTitle, options.loadingDescription);

  try {
    const result = await promise;
    toast.dismiss(toastId);
    const txHash = options.getTxHash ? options.getTxHash(result) : undefined;
    showTxSuccess(options.successTitle, txHash, options.successDescription);
    return result;
  } catch (err: any) {
    toast.dismiss(toastId);
    showTxError(options.errorTitle, err);
    throw err;
  }
};
