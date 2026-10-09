import React, { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { RiShieldStarFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { Buttons } from "@/Utils";

const COLORS = ["#E9F9F9", "#C0938E", "#000000", "#B3CEDE"];

const copyText = text =>
	navigator.clipboard.writeText(text).then(
		() => toast.info("Copied", { autoClose: 2000 }),
		err => toast.warn(`Could not copy: ${err}`, { autoClose: 2000 })
	);

/** Bank picker + generate button (shown until the user has a Pocketfi account). */
const BankPicker = ({ banks, loading, onGenerate }) => {
	const [selected, setSelected] = useState("");
	// a single available bank needs no choosing
	const bank = banks.length === 1 ? banks[0].value : selected;

	if (!banks.length)
		return (
			<p className="text-muted my-4 text-center">
				No Pocketfi bank is available right now. Please try again later.
			</p>
		);

	return (
		<div className="my-4">
			<h3 className="Lexend">Pocketfi Linked Account</h3>
			{banks.length > 1 && (
				<>
					<p className="text-muted mb-2">Choose the bank for your account</p>
					<div
						role="radiogroup"
						aria-label="Choose bank"
						className="d-flex flex-wrap gap-2 mb-3">
						{banks.map(item => {
							const active = bank === item.value;
							return (
								<button
									key={item.value}
									type="button"
									role="radio"
									aria-checked={active}
									disabled={loading}
									onClick={() => setSelected(item.value)}
									className="rounded10 px-3 py-2 text-start"
									style={{
										minWidth: 110,
										background: active ? "var(--brand-soft)" : "#fff",
										border: `2px solid ${
											active ? "var(--brand)" : "rgba(0,0,0,.12)"
										}`,
										color: "var(--brand)",
										transition: "border-color .15s, background .15s",
									}}>
									<span className="fw-bold d-block">{item.label}</span>
									{item.note && (
										<small className="text-muted">{item.note}</small>
									)}
								</button>
							);
						})}
					</div>
				</>
			)}
			<Buttons
				title={
					banks.length === 1
						? `generate ${banks[0].label} account`
						: "generate account"
				}
				css="btn-primary1 text-capitalize py-3 w-50 mx-auto"
				width={"w-50"}
				onClick={() => onGenerate(bank)}
				style={{ borderRadius: "30px" }}
				loading={loading}
				disabled={!bank}
			/>
		</div>
	);
};

/**
 * Pocketfi linked (virtual) account for the Fund Wallet -> Linked accounts modal.
 * Shows the generated bank accounts, or the bank picker when there are none yet.
 */
const PocketfiLinkedAccount = ({ account, banks = [], loading, onGenerate }) => {
	const accounts = account?.banks;

	if (!accounts?.length)
		return <BankPicker banks={banks} loading={loading} onGenerate={onGenerate} />;

	return (
		<>
			<h3 className="Lexend">Pocketfi Linked Account</h3>
			<div>
				{accounts.map((bank, i) => {
					const color = COLORS[i % COLORS.length];
					return (
						<div
							key={`${bank?.accountNumber}-${i}`}
							className="my-3 d-flex align-items-center rounded10 bg-light p-3">
							<div className="d-flex me-2">
								<div
									className="p-3 d-flex rounded10 align-items-center justify-content-center"
									style={{ background: color }}>
									<RiShieldStarFill
										size={24}
										color={color === "#000000" ? "#fff" : "#000"}
									/>
								</div>
							</div>
							<div>
								<h6 className="fw-bold text-muted text-capitalize">
									{bank?.bankName}
								</h6>
								<h6 className="fw-bold force-d-flex">
									{bank?.accountNumber}{" "}
									<BiCopy
										size={20}
										className="ms-3 myCursor"
										onClick={() => copyText(bank?.accountNumber)}
									/>
								</h6>
								{bank?.accountName && (
									<small className="text-muted">{bank.accountName}</small>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default PocketfiLinkedAccount;
