'use client';

import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [phone, setPhone] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [pin, setPin] = useState<string[]>(Array(6).fill(""));
  const [pinFocusedIndex, setPinFocusedIndex] = useState<number | null>(null);
  const [view, setView] = useState<"login" | "otp" | "loan" | "statement" | "submitted">("login");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpFocusedIndex, setOtpFocusedIndex] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(41);
  const [loanAmount, setLoanAmount] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState("");
  const [loanPurpose, setLoanPurpose] = useState("");
  const [repaymentRating, setRepaymentRating] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [existingLoan, setExistingLoan] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [loanUrgency, setLoanUrgency] = useState("");
  const [bankStatement, setBankStatement] = useState<File | null>(null);
  const [statementConfirmed, setStatementConfirmed] = useState(false);
  const [statementError, setStatementError] = useState("");
  const pinRefs = useRef<Array<HTMLInputElement | null>>([]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const digitsOnly = (value: string) => value.replace(/\D/g, "");
  const maxPhoneDigits = 10;

  const formattedPhone = useMemo(() => digitsOnly(phone).slice(0, maxPhoneDigits), [phone]);
  const isValidPhone = /^7\d{8,9}$/.test(formattedPhone);
  const isValidPin = pin.slice(1).every((value) => value.length === 1);
  const isReady = isValidPhone && isValidPin;
  const isOtpReady = otp.every((value) => value.length === 1);
  const otpExpired = countdown <= 0;
  const requestedAmountValue = Number(loanAmount);
  const monthlyIncomeValue = Number(monthlyIncome);
  const monthlyPaymentValue = Number(monthlyPayment);
  const maximumEligibleAmount = monthlyIncomeValue > 0 ? monthlyIncomeValue * 0.5 : 0;
  const maximumMonthlyPayment = monthlyIncomeValue > 0 ? monthlyIncomeValue * 0.4 : 0;
  const hasValidLoanAmount = requestedAmountValue > 0 && requestedAmountValue <= maximumEligibleAmount;
  const hasValidMonthlyPayment = monthlyPaymentValue > 0 && monthlyPaymentValue <= maximumMonthlyPayment;
  const isLoanFormReady = Boolean(
    loanAmount &&
      monthlyPayment &&
      loanPurpose &&
      repaymentRating &&
      incomeSource &&
      monthlyIncome &&
      employmentStatus &&
      existingLoan &&
      repaymentPeriod &&
      loanUrgency,
  ) && hasValidLoanAmount && hasValidMonthlyPayment;
  const isStatementReady = Boolean(bankStatement && statementConfirmed);

  const handleStatementChange = (file: File | undefined) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setBankStatement(null);
      setStatementError("This file is larger than 10MB. Please choose a smaller file.");
      return;
    }

    setBankStatement(file);
    setStatementError("");
  };

  useEffect(() => {
    if (view !== "otp") return;

    if (countdown <= 0) return;

    const timer = window.setInterval(() => {
      setCountdown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [view, countdown]);

  const handlePhoneChange = (value: string) => {
    setPhone(digitsOnly(value).slice(0, maxPhoneDigits));
  };

  const handlePinChange = (index: number, value: string) => {
    const digit = digitsOnly(value).slice(-1);
    const nextPin = [...pin];
    nextPin[index] = digit;
    setPin(nextPin);

    if (digit && index < pin.length - 1) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = digitsOnly(value).slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  if (view === "submitted") {
    return (
      <main className="min-h-screen bg-[#f7c900] px-4 pb-10 pt-5 text-[#111111] sm:px-6 lg:px-10">
        <header className="flex justify-center pt-2">
          <div className="flex items-center gap-4 text-[clamp(1.8rem,3vw,3.2rem)] font-black leading-none tracking-[-0.08em]">
            <span className="text-[0.9em] font-black">≡</span>
            <span>MTN</span>
            <span className="font-extrabold">Fast credit</span>
          </div>
        </header>

        <section className="mx-auto mt-14 w-full max-w-[680px] rounded-[28px] border border-[#1d1d1d]/10 bg-[#f3f3f3] p-6 text-center shadow-[0_18px_45px_rgba(17,17,17,0.1)] sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7c900] text-[2.5rem] font-black" aria-hidden="true">
            ✓
          </div>
          <p className="mt-6 text-[0.82rem] font-black uppercase tracking-[0.14em] text-[#111111]/55">Application received</p>
          <h1 className="mt-2 text-[clamp(2.3rem,4vw,3.8rem)] font-black leading-[0.92] tracking-[-0.07em]">
            Your application is on its way.
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-[1.05rem] leading-7 text-[#111111]/70">
            We have received your loan details and bank statement. Our team will review your application and contact you with an update.
          </p>
          <div className="mt-8 rounded-[16px] bg-[#f7eaa1] px-4 py-3 text-left text-[0.92rem] leading-6 text-[#111111]/75">
            <span className="font-black text-[#111111]">What happens next?</span> Your information will be checked securely before a decision is made.
          </div>
          <button
            type="button"
            onClick={() => setView("login")}
            className="mt-7 flex h-[56px] w-full items-center justify-center rounded-[16px] bg-[#f7c900] text-[1.1rem] font-black text-[#111111] transition-colors hover:bg-[#f4bf00]"
          >
            Return to login
          </button>
        </section>
      </main>
    );
  }

  if (view === "statement") {
    return (
      <main className="min-h-screen bg-[#f7c900] px-4 pb-10 pt-5 text-[#111111] sm:px-6 lg:px-10">
        <header className="flex justify-center pt-2">
          <div className="flex items-center gap-4 text-[clamp(1.8rem,3vw,3.2rem)] font-black leading-none tracking-[-0.08em]">
            <span className="text-[0.9em] font-black">≡</span>
            <span>MTN</span>
            <span className="font-extrabold">Fast credit</span>
          </div>
        </header>

        <p className="mt-2 text-center text-[clamp(0.9rem,1.3vw,1.5rem)] italic font-medium text-[#111111]/80">
          Quick loans. Anytime. Anywhere.
        </p>

        <section className="mx-auto mt-8 w-full max-w-[900px] rounded-[28px] border border-[#1d1d1d]/10 bg-[#f3f3f3] p-5 shadow-[0_18px_45px_rgba(17,17,17,0.08)] sm:p-7 lg:p-8">
          <button
            type="button"
            onClick={() => setView("loan")}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1d1d1d]/20 bg-transparent px-3 py-1.5 text-[0.82rem] font-medium text-[#111111] hover:border-[#111111]/40"
          >
            <span>←</span>
            <span>Back to questions</span>
          </button>

          <div className="mb-6 flex items-center gap-2 text-[0.78rem] font-black uppercase tracking-[0.12em] text-[#111111]/50">
            <span className="h-2 w-2 rounded-full bg-[#f7c900]" />
            <span>Step 3 of 3</span>
          </div>

          <h1 className="text-[clamp(2.3rem,3.8vw,4rem)] font-black leading-[0.9] tracking-[-0.07em]">
            Upload your bank statement
          </h1>

          <p className="mt-3 text-[clamp(1rem,1.4vw,1.5rem)] font-medium text-[#111111]/70">
            We use your recent statement to review your loan application.
          </p>

          <label className="mt-8 flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-[18px] border-2 border-dashed border-[#111111]/35 bg-[#faf8ec] px-5 text-center transition-colors hover:border-[#111111] hover:bg-[#fffbea]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7c900] text-[2rem] font-black leading-none">↑</span>
            <span className="mt-3 text-[1.15rem] font-black">Choose a bank statement</span>
            <span className="mt-1 text-[0.9rem] text-[#111111]/65">PDF, JPG, or PNG up to 10MB</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(event) => handleStatementChange(event.target.files?.[0])}
              className="sr-only"
            />
          </label>

          {statementError && <p className="mt-3 text-sm font-bold text-[#b42318]">{statementError}</p>}

          {bankStatement && (
            <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-[#111111]/10 bg-[#f7eaa1] px-4 py-3 text-[0.95rem]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#f3f3f3] text-xs font-black uppercase">{bankStatement.type === "application/pdf" ? "PDF" : "IMG"}</span>
              <span className="min-w-0 flex-1 truncate font-bold">{bankStatement.name}</span>
              <span className="shrink-0 text-[#111111]/65">{(bankStatement.size / 1024 / 1024).toFixed(1)} MB</span>
            </div>
          )}

          <label className="mt-6 flex cursor-pointer items-start gap-3 text-[0.95rem] leading-6 text-[#111111]/80">
            <input
              type="checkbox"
              checked={statementConfirmed}
              onChange={(event) => setStatementConfirmed(event.target.checked)}
              className="mt-1 h-4 w-4 accent-[#f7c900]"
            />
            <span>I confirm this is my bank statement and I agree to its use for reviewing my loan application.</span>
          </label>

          <div className="mt-6 flex items-start gap-3 rounded-[14px] border border-[#111111]/10 bg-[#faf8ec] px-4 py-3 text-[0.86rem] leading-5 text-[#111111]/65">
            <span className="font-black text-[#111111]">●</span>
            <span>Your statement is used only to assess your loan application and is handled securely.</span>
          </div>

          <button
            type="button"
            disabled={!isStatementReady}
            onClick={() => {
              if (isStatementReady) {
                setView("submitted");
              }
            }}
            className={`mt-7 flex h-[58px] w-full items-center justify-center rounded-[16px] text-[clamp(1.1rem,1.5vw,1.7rem)] font-black tracking-[-0.04em] text-[#111111] transition-all duration-200 ${
              isStatementReady ? "bg-[#f7c900] hover:bg-[#f4bf00]" : "cursor-not-allowed bg-[#d9d9d9]"
            }`}
          >
            Submit application <span className="ml-2 text-xl">→</span>
          </button>
        </section>
      </main>
    );
  }

  if (view === "loan") {
    return (
      <main className="min-h-screen bg-[#f7c900] px-4 pb-10 pt-5 text-[#111111] sm:px-6 lg:px-10">
        <header className="flex justify-center pt-2">
          <div className="flex items-center gap-4 text-[clamp(1.8rem,3vw,3.2rem)] font-black leading-none tracking-[-0.08em]">
            <span className="text-[0.9em] font-black">≡</span>
            <span>MTN</span>
            <span className="font-extrabold">Fast credit</span>
          </div>
        </header>

        <p className="mt-2 text-center text-[clamp(0.9rem,1.3vw,1.5rem)] italic font-medium text-[#111111]/80">
          Quick loans. Anytime. Anywhere.
        </p>

        <section className="mx-auto mt-8 w-full max-w-[900px] rounded-[28px] border border-[#1d1d1d]/10 bg-[#f3f3f3] p-5 shadow-[0_0_0_1px_rgba(17,17,17,0.02)] sm:p-7 lg:p-8">
          <button
            type="button"
            onClick={() => setView("login")}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1d1d1d]/20 bg-transparent px-3 py-1.5 text-[0.82rem] font-medium text-[#111111] hover:border-[#111111]/40"
          >
            <span>←</span>
            <span>Back to login</span>
          </button>

          <h1 className="text-[clamp(2.3rem,3.8vw,4rem)] font-black leading-[0.9] tracking-[-0.07em]">
            Tell us about your loan
          </h1>

          <p className="mt-3 text-[clamp(1rem,1.4vw,1.5rem)] font-medium text-[#111111]/70">
            Answer a few questions so we can understand what you need.
          </p>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">How much do you want to borrow?</span>
              <div className="mt-2 flex h-[56px] items-center rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 focus-within:border-[#f7c900]">
                <span className="mr-3 border-r border-[#111111]/30 pr-3 font-bold">RWF</span>
                <input
                  type="number"
                  min="1000"
                  max={maximumEligibleAmount || undefined}
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(event.target.value)}
                  placeholder="e.g. 50,000"
                  className="h-full w-full bg-transparent text-[1rem] outline-none placeholder:text-[#111111]/40"
                />
              </div>
              {monthlyIncomeValue > 0 && (
                <span className={`mt-2 block text-[0.82rem] font-bold ${hasValidLoanAmount ? "text-[#487a3d]" : "text-[#b42318]"}`}>
                  Maximum eligible loan: RWF {maximumEligibleAmount.toLocaleString()}
                </span>
              )}
            </label>

            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">How much can you pay per month?</span>
              <div className="mt-2 flex h-[56px] items-center rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 focus-within:border-[#f7c900]">
                <span className="mr-3 border-r border-[#111111]/30 pr-3 font-bold">RWF</span>
                <input
                  type="number"
                  min="1000"
                  max={maximumMonthlyPayment || undefined}
                  value={monthlyPayment}
                  onChange={(event) => setMonthlyPayment(event.target.value)}
                  placeholder="e.g. 10,000"
                  className="h-full w-full bg-transparent text-[1rem] outline-none placeholder:text-[#111111]/40"
                />
              </div>
              {monthlyIncomeValue > 0 && !hasValidMonthlyPayment && monthlyPayment && (
                <span className="mt-2 block text-[0.82rem] font-bold text-[#b42318]">
                  Monthly payment cannot be more than RWF {maximumMonthlyPayment.toLocaleString()}.
                </span>
              )}
            </label>

            <label className="block sm:col-span-2">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">What will you use the loan for?</span>
              <select
                value={loanPurpose}
                onChange={(event) => setLoanPurpose(event.target.value)}
                className="mt-2 h-[56px] w-full rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 text-[1rem] outline-none focus:border-[#f7c900]"
              >
                <option value="">Select a purpose</option>
                <option value="business">Business</option>
                <option value="school">School fees</option>
                <option value="emergency">Emergency expenses</option>
                <option value="personal">Personal needs</option>
              </select>
            </label>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">What is your main source of income?</span>
              <select
                value={incomeSource}
                onChange={(event) => setIncomeSource(event.target.value)}
                className="mt-2 h-[56px] w-full rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 text-[1rem] outline-none focus:border-[#f7c900]"
              >
                <option value="">Select income source</option>
                <option value="salary">Salary</option>
                <option value="business">Business</option>
                <option value="freelance">Freelance work</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">What is your average monthly income?</span>
              <div className="mt-2 flex h-[56px] items-center rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 focus-within:border-[#f7c900]">
                <span className="mr-3 border-r border-[#111111]/30 pr-3 font-bold">RWF</span>
                <input
                  type="number"
                  min="1000"
                  value={monthlyIncome}
                  onChange={(event) => setMonthlyIncome(event.target.value)}
                  placeholder="e.g. 150,000"
                  className="h-full w-full bg-transparent text-[1rem] outline-none placeholder:text-[#111111]/40"
                />
              </div>
              <span className="mt-2 block text-[0.82rem] font-medium text-[#111111]/60">
                We use 50% of this income to calculate the maximum loan amount.
              </span>
            </label>

            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">What is your employment status?</span>
              <select
                value={employmentStatus}
                onChange={(event) => setEmploymentStatus(event.target.value)}
                className="mt-2 h-[56px] w-full rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 text-[1rem] outline-none focus:border-[#f7c900]"
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-employed</option>
                <option value="student">Student</option>
                <option value="other">Other</option>
              </select>
            </label>

            <fieldset>
              <legend className="text-[1rem] font-black tracking-[-0.04em]">Do you currently have another loan?</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {['Yes', 'No'].map((answer) => (
                  <label key={answer} className="cursor-pointer">
                    <input
                      type="radio"
                      name="existing-loan"
                      value={answer.toLowerCase()}
                      checked={existingLoan === answer.toLowerCase()}
                      onChange={(event) => setExistingLoan(event.target.value)}
                      className="peer sr-only"
                    />
                    <span className="flex h-[56px] items-center justify-center rounded-[14px] border border-[#111111]/35 font-bold transition-colors peer-checked:border-[#111111] peer-checked:bg-[#f7c900] hover:border-[#111111]">
                      {answer}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">How long would you like to repay?</span>
              <select
                value={repaymentPeriod}
                onChange={(event) => setRepaymentPeriod(event.target.value)}
                className="mt-2 h-[56px] w-full rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 text-[1rem] outline-none focus:border-[#f7c900]"
              >
                <option value="">Select repayment period</option>
                <option value="1-3">1 to 3 months</option>
                <option value="4-6">4 to 6 months</option>
                <option value="7-12">7 to 12 months</option>
              </select>
            </label>

            <label className="block">
              <span className="block text-[1rem] font-black tracking-[-0.04em]">How soon do you need the money?</span>
              <select
                value={loanUrgency}
                onChange={(event) => setLoanUrgency(event.target.value)}
                className="mt-2 h-[56px] w-full rounded-[14px] border border-[#111111]/40 bg-[#f3f3f3] px-4 text-[1rem] outline-none focus:border-[#f7c900]"
              >
                <option value="">Select urgency</option>
                <option value="today">Today</option>
                <option value="this-week">This week</option>
                <option value="this-month">This month</option>
              </select>
            </label>
          </div>

          <fieldset className="mt-7">
            <legend className="text-[1rem] font-black tracking-[-0.04em]">How confident are you that you can repay on time?</legend>
            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="cursor-pointer">
                  <input
                    type="radio"
                    name="repayment-rating"
                    value={rating}
                    checked={repaymentRating === String(rating)}
                    onChange={(event) => setRepaymentRating(event.target.value)}
                    className="peer sr-only"
                  />
                  <span className="flex h-12 items-center justify-center rounded-[12px] border border-[#111111]/35 font-black transition-colors peer-checked:border-[#111111] peer-checked:bg-[#f7c900] hover:border-[#111111]">
                    {rating}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[0.78rem] font-medium text-[#111111]/60">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!isLoanFormReady}
            onClick={() => {
              if (isLoanFormReady) {
                setView("statement");
              }
            }}
            className={`mt-7 flex h-[58px] w-full items-center justify-center rounded-[16px] text-[clamp(1.1rem,1.5vw,1.7rem)] font-black tracking-[-0.04em] text-[#111111] transition-all duration-200 ${
              isLoanFormReady ? "bg-[#f7c900] hover:bg-[#f4bf00]" : "cursor-not-allowed bg-[#d9d9d9]"
            }`}
          >
            Continue <span className="ml-2 text-xl">→</span>
          </button>
        </section>
      </main>
    );
  }

  if (view === "otp") {
    return (
      <main className="min-h-screen bg-[#f7c900] text-[#111111]">
        <header className="flex justify-center pt-2">
          <div className="flex items-center gap-4 text-[clamp(1.8rem,3vw,3.2rem)] font-black leading-none tracking-[-0.08em]">
            <span className="text-[0.9em] font-black">≡</span>
            <span>MTN</span>
            <span className="font-extrabold">Fast credit</span>
          </div>
        </header>

        <p className="mt-2 text-center text-[clamp(0.9rem,1.3vw,1.5rem)] italic font-medium text-[#111111]/80">
          Quick loans. Anytime. Anywhere.
        </p>

        <section className="mx-auto mt-8 w-full max-w-[1240px] rounded-[28px] border border-[#1d1d1d]/10 bg-[#f3f3f3] p-5 shadow-[0_0_0_1px_rgba(17,17,17,0.02)] sm:p-7 lg:p-8">
          <button
            type="button"
            onClick={() => setView("login")}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1d1d1d]/20 bg-transparent px-3 py-1.5 text-[0.82rem] font-medium text-[#111111] hover:border-[#111111]/40"
          >
            <span>←</span>
            <span>Back to login</span>
          </button>

          <h1 className="text-[clamp(2.3rem,3.8vw,4rem)] font-black leading-[0.9] tracking-[-0.07em]">
            Verify your code
          </h1>

          <p className="mt-3 text-[clamp(1rem,1.4vw,1.5rem)] font-medium text-[#111111]/70">
            Enter the 6-digit code sent to +250{formattedPhone}
          </p>

          <div className="mt-6">
            <label className="block text-[clamp(1rem,1.2vw,1.4rem)] font-black tracking-[-0.04em] text-[#111111]">
              Enter OTP Code
            </label>

            <div className="mt-3 flex justify-center gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, index) => {
                const value = otp[index] ?? "";
                const isFilled = Boolean(value);
                const isActive = otpFocusedIndex === index || (otp.every((digit) => digit !== "") && index === otp.length - 1);

                return (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onFocus={() => setOtpFocusedIndex(index)}
                    onBlur={() => setOtpFocusedIndex((current) => (current === index ? null : current))}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    aria-label={`OTP digit ${index + 1}`}
                    className={`flex h-14 w-12 rounded-[12px] border-[2px] bg-transparent text-center text-[1.2rem] font-semibold text-[#111111] outline-none transition-colors duration-200 sm:h-16 sm:w-14 ${
                      isFilled || isActive || otpFocusedIndex === index
                        ? "border-[#111111]/70"
                        : "border-[#111111]/30 hover:border-[#111111]/60"
                    }`}
                  />
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[1rem] font-medium text-[#111111]">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#111111]/60 text-[0.6rem]">
                ⏱
              </span>
              <span>{countdown}s</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isOtpReady) {
                setView("loan");
              }
            }}
            className={`mt-6 flex h-[58px] w-full items-center justify-center rounded-[16px] text-[clamp(1.1rem,1.5vw,1.7rem)] font-black tracking-[-0.04em] text-[#111111] transition-all duration-200 ${
              isOtpReady ? "bg-[#f7c900] hover:bg-[#f4bf00]" : "cursor-not-allowed bg-[#d9d9d9]"
            }`}
          >
            Verify Code <span className="ml-2 text-xl">→</span>
          </button>

          <button
            type="button"
            className="mt-4 flex h-[58px] w-full items-center justify-center rounded-[16px] bg-[#d9d9d9] text-[clamp(1.1rem,1.5vw,1.7rem)] font-bold text-[#111111] transition-opacity hover:opacity-90"
          >
            Resend code
          </button>
        </section>

        {otpExpired && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/20 px-4">
            <div className="w-full max-w-[420px] rounded-[20px] bg-[#f3f3f3] p-5 shadow-[0_20px_45px_rgba(17,17,17,0.15)]">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4d4d] text-[2rem] font-black text-white">
                  !
                </div>
              </div>

              <h2 className="mt-4 text-center text-[1.8rem] font-black tracking-[-0.05em] text-[#111111]">
                OTP Expired
              </h2>

              <p className="mt-3 text-center text-[1rem] leading-6 text-[#111111]/75">
                The verification code has expired. Please request a new code to continue.
              </p>

              <button
                type="button"
                onClick={() => {
                  setCountdown(41);
                  setOtp(Array(6).fill(""));
                  setOtpFocusedIndex(null);
                }}
                className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#f7c900] text-[1.1rem] font-black text-[#111111] hover:bg-[#f4bf00]"
              >
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => setView("login")}
                className="mt-3 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#d9d9d9] text-[1.1rem] font-bold text-[#111111] hover:opacity-90"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7c900] text-[#111111]">
      <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-[1280px]">
          <header className="flex justify-center pt-2">
            <div className="flex items-center gap-4 text-[clamp(1.8rem,3vw,3.2rem)] font-black leading-none tracking-[-0.08em]">
              <span className="text-[0.9em] font-black">≡</span>
              <span>MTN</span>
              <span className="font-extrabold">Fast credit</span>
            </div>
          </header>

          <p className="mt-4 text-center text-[clamp(0.9rem,1.3vw,1.5rem)] italic font-medium text-[#111111]/80">
            Quick loans. Anytime. Anywhere.
          </p>

          <div className="mx-auto mt-8 w-full max-w-[1240px] rounded-[28px] border border-[#1d1d1d]/10 bg-[#f3f3f3] p-5 shadow-[0_0_0_1px_rgba(17,17,17,0.02)] sm:p-7 lg:p-8">
            <h1 className="text-[clamp(2.3rem,3.8vw,4rem)] font-black leading-[0.9] tracking-[-0.07em]">
              Welcome back
            </h1>

            <p className="mt-3 text-[clamp(1rem,1.4vw,1.6rem)] font-medium text-[#111111]/75">
              Log in to MTN account
            </p>

            <div className="mt-6 flex w-full items-center rounded-[16px] border-[3px] border-[#f7c900] bg-[#f3e7a2] px-4 py-3 shadow-inner">
              <span className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7c900] text-base font-black text-[#111111]">
                !
              </span>
              <span className="text-[clamp(1.1rem,1.5vw,1.8rem)] font-bold tracking-[-0.04em] text-[#111111]">
                Enter MTN number.
              </span>
            </div>

            <div className="mt-6">
              <label className="block text-[clamp(1rem,1.2vw,1.4rem)] font-black tracking-[-0.04em] text-[#111111]">
                Phone Number
              </label>

              <div className={`mt-2 flex h-[58px] w-full items-center overflow-hidden rounded-[14px] border bg-[#f3f3f3] pl-4 pr-3 transition-colors duration-200 ${
                phoneFocused || formattedPhone.length > 0
                  ? "border-[#f7c900] shadow-[0_0_0_2px_rgba(247,201,0,0.15)]"
                  : "border-[#1d1d1d]/55 hover:border-[#111111]"
              }`}>
                <span className="mr-4 flex h-full items-center border-r border-[#1d1d1d]/30 pr-4 text-[clamp(1rem,1.3vw,1.5rem)] font-medium text-[#111111]">
                  +250
                </span>
                <input
                  aria-label="Phone number"
                  type="text"
                  inputMode="numeric"
                  maxLength={maxPhoneDigits}
                  value={formattedPhone}
                  onFocus={() => setPhoneFocused(true)}
                  onBlur={() => setPhoneFocused(false)}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="7XX XXX XXX"
                  className="h-full w-full border-0 bg-transparent text-[clamp(1rem,1.3vw,1.5rem)] font-medium text-[#111111] placeholder:text-[#111111]/40 focus:outline-none"
                />
              </div>

              {formattedPhone.length > 0 && !isValidPhone ? (
                <p className="mt-2 text-sm font-bold text-[#b42318]">Phone number must be 9–10 digits and begin with 7.</p>
              ) : (
                <p className="mt-2 text-[0.82rem] font-medium text-[#111111]/65">
                  Enter a valid MTN number. Maximum of {maxPhoneDigits} digits.
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-[clamp(0.96rem,1.15vw,1.3rem)] font-black tracking-[-0.04em] text-[#111111]">
                Enter your MOMO PIN
              </label>

              <div className="mt-3 flex justify-center gap-3 sm:gap-4">
                {Array.from({ length: 6 }).map((_, index) => {
                  const isFirstSlot = index === 0;
                  const visibleIndex = isFirstSlot ? 1 : index;
                  const value = pin[visibleIndex] ?? "";
                  const isFilled = Boolean(value);
                  const isActive =
                    index === pin.findIndex((digit) => digit === "") ||
                    (pin.every((digit) => digit !== "") && index === pin.length - 1);

                  return (
                    <input
                      key={index}
                      ref={(el) => {
                        pinRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={value}
                      onFocus={() => setPinFocusedIndex(index)}
                      onBlur={() => setPinFocusedIndex((current) => (current === index ? null : current))}
                      onChange={(event) => handlePinChange(visibleIndex, event.target.value)}
                      onKeyDown={(event) => handlePinKeyDown(visibleIndex, event)}
                      aria-label={`PIN digit ${visibleIndex + 1}`}
                      className={`flex h-12 w-10 rounded-[12px] border-[2px] bg-transparent text-center text-[1.2rem] font-semibold text-[#111111] outline-none transition-colors duration-200 sm:h-14 sm:w-12 ${
                        isActive || isFilled || pinFocusedIndex === index
                          ? "border-[#f7c900]"
                          : "border-[#111111]/50 hover:border-[#111111]"
                      } ${isFirstSlot ? "hidden" : ""}`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isReady) {
                  setView("otp");
                }
              }}
              className={`mt-6 flex h-[54px] w-full items-center justify-center rounded-[16px] text-[clamp(1rem,1.4vw,1.6rem)] font-black tracking-[-0.04em] text-[#111111] transition-all duration-200 ${
                isReady
                  ? "bg-[#f7c900] hover:bg-[#f4bf00] cursor-pointer"
                  : "cursor-not-allowed bg-[#d9d9d9]"
              }`}
            >
              Login <span className="ml-2 text-xl">→</span>
            </button>

            <div className="mt-3 flex items-center justify-center gap-2 text-[0.8rem] font-medium text-[#111111]/70">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#111111]/60 text-[0.62rem]">
                i
              </span>
              <span>Your information is safe and secure</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
