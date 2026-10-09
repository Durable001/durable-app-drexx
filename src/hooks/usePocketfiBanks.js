import { useMemo } from "react";
import { POCKETFI_BANK_OPTIONS } from "@/constants/pocketfi";

/** Banks the admin has left switched on (Settings -> Pocketfi banks). */
export const usePocketfiBanks = usecase => {
	const disabled = usecase?.usecase?.pocketfiBanksDisabled;
	return useMemo(
		() =>
			POCKETFI_BANK_OPTIONS.filter(bank => !disabled?.includes(bank.value)),
		[disabled]
	);
};
