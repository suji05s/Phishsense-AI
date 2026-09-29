import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Award,
  AlertTriangle,
  Lightbulb,
  ExternalLink
} from 'lucide-react';

interface QuizScenario {
  id: string;
  sender: string;
  senderName: string;
  subject: string;
  body: string;
  isPhishing: boolean;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  threatName: string;
  redFlags: string[];
  explanation: string;
  safeTip: string;
}

const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: 'quiz-1',
    sender: 'security-update@netfllx-billing.co',
    senderName: 'Netflix Member Services',
    subject: 'Action Required: Your membership is on hold due to declined payment',
    body: `Hi Member,\n\nWe were unable to process your payment for the next billing cycle. As a result, your streaming service has been temporarily paused.\n\nTo restart your membership without losing your watch history and recommendations, please update your billing details immediately:\n\nhttps://netfllx-billing.co/verify-account/id-9982\n\nIf you do not update within 24 hours, your account will be permanently deactivated.\n\nThe Netflix Team`,
    isPhishing: true,
    difficulty: 'Beginner',
    threatName: 'Credential & Credit Card Harvester (Lookalike Domain)',
    redFlags: [
      'Lookalike domain "netfllx-billing.co" with double "ll" instead of "netflix.com"',
      'Artificial 24-hour urgency deadline designed to induce panic',
      'Generic greeting ("Hi Member") instead of personalized name'
    ],
    explanation: 'Scammers frequently register domains that look like Netflix or Apple with subtle typos (typosquatting). They use panic ("service paused within 24 hours") to rush you into entering credit card numbers.',
    safeTip: 'Never click billing links in emails. Instead, open a browser, type "netflix.com" directly, log in, and check your account status there.'
  },
  {
    id: 'quiz-2',
    sender: 'comments-noreply@docs.google.com',
    senderName: 'Google Docs',
    subject: 'Priya Sharma tagged you in "Q3 Performance Review & Compensation 2026.docx"',
    body: `Priya Sharma (priya.s@acmecorp.com) mentioned you in the following document:\n\n"Hi Sujatha, please take a look at the revised budget allocations for Q3 before our executive meeting tomorrow."\n\nOpen in Docs: https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit\n\nGoogle LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043`,
    isPhishing: false,
    difficulty: 'Intermediate',
    threatName: 'Legitimate Google Docs Notification',
    redFlags: [],
    explanation: 'This email is completely authentic. It originated directly from Google\'s official notification server (docs.google.com), references a valid internal colleague, and links to an official HTTPS Google Docs URL without domain trickery.',
    safeTip: 'Check that Google Docs links start with "https://docs.google.com/document/" and that the sender domain ends strictly with "@docs.google.com" or "@google.com".'
  },
  {
    id: 'quiz-3',
    sender: 'mark.ceo@acme-corp-management.org',
    senderName: 'Mark Zuckerberg (CEO)',
    subject: 'URGENT & STRICTLY CONFIDENTIAL - Wire payment needed before 3 PM',
    body: `Are you at your desk right now?\n\nI am currently in an urgent confidential meeting with our legal counsel regarding an unannounced overseas acquisition. I cannot take phone calls.\n\nWe need an immediate wire transfer of $45,000 to our international escrow partner today. Process the transfer to the details attached in this link:\nhttp://escrow-intl-wire.org/docket/45000\n\nKeep this strictly between us until the press release tomorrow morning.\n\nMark\nChief Executive Officer`,
    isPhishing: true,
    difficulty: 'Advanced',
    threatName: 'Executive Whaling / Business Email Compromise (BEC)',
    redFlags: [
      'Spoofed sender address "@acme-corp-management.org" rather than official company domain',
      'High secrecy demand ("do not discuss this with anyone / strictly confidential")',
      'Explicit excuse for why they cannot speak on the phone to prevent verification'
    ],
    explanation: 'This is the classic "CEO Wire Fraud" attack. Criminals impersonate executives in high-stress scenarios, explicitly telling employees not to call or speak to others so the fraud goes undiscovered until money is wired.',
    safeTip: 'Always establish a secondary out-of-band verification channel (such as a phone call or in-person check) for any urgent financial transaction over $1,000.'
  },
  {
    id: 'quiz-4',
    sender: 'delivery-exception@usps-tracking-notify.top',
    senderName: 'USPS Parcel Service',
    subject: 'Notice: Package #940551020088921 could not be delivered due to incomplete address',
    body: `Dear Customer,\n\nYour package with tracking number 940551020088921 could not be delivered on August 26, 2026 because the street address provided is incomplete.\n\nTo update your delivery address and schedule a redelivery attempt, click below and pay the $1.95 redelivery fee:\nhttps://usps-tracking-notify.top/redeliver/package?id=940551020088921\n\nIf not updated within 48 hours, the parcel will be returned to the sender.\n\nUnited States Postal Service`,
    isPhishing: true,
    difficulty: 'Beginner',
    threatName: 'Smishing/Phishing Delivery Scam ($1.95 Fee Trap)',
    redFlags: [
      'Unsolicited package alert from fake domain ".top" instead of "usps.com"',
      'Asking for a small fee ($1.95) to harvest full credit card and CVV numbers',
      'Generic tracking code sent without your account context'
    ],
    explanation: 'Fake package delivery emails are among the most common scams in the world. The small "$1.95 fee" is a trick to get you to type your credit card details into their hacker database.',
    safeTip: 'USPS, FedEx, and UPS will NEVER ask for payment to redeliver a package via email. Track packages only at official "usps.com".'
  },
  {
    id: 'quiz-5',
    sender: 'no-reply@accounts.google.com',
    senderName: 'Google Security',
    subject: 'Security alert: New sign-in from Chrome on macOS in Bangalore, India',
    body: `Your Google Account (sujathaofficial2828@gmail.com) was just signed in to from a new Mac device.\n\nDevice: Chrome on macOS\nLocation: Bangalore, Karnataka, India\nTime: Today at 10:14 AM IST\n\nIf this was you, you don't need to do anything. If you didn't recognize this activity, we will help you secure your account:\n\nCheck activity: https://myaccount.google.com/notifications\n\nYou received this mandatory email service announcement to update you about important changes to your Google Account.`,
    isPhishing: false,
    difficulty: 'Intermediate',
    threatName: 'Legitimate Google Account Security Notification',
    redFlags: [],
    explanation: 'This is an authentic security alert from Google. It links strictly to "https://myaccount.google.com/notifications" and originated from the genuine "accounts.google.com" server with cryptographically verified SPF and DKIM signatures.',
    safeTip: 'Legitimate security alerts will never threaten instant deletion or ask you to reply with your password. They simply advise you to check your account dashboard.'
  }
];

export const PhishingTrainerLab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<'safe' | 'phishing' | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);

  const scenario = QUIZ_SCENARIOS[currentIndex];

  const handleGuess = (guess: 'safe' | 'phishing') => {
    if (userAnswer !== null) return; // already answered this round

    const isCorrect = (guess === 'phishing' && scenario.isPhishing) || (guess === 'safe' && !scenario.isPhishing);
    setUserAnswer(guess);
    setShowExplanation(true);
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_SCENARIOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer(null);
    setShowExplanation(false);
    setScore({ correct: 0, total: 0 });
    setCompleted(false);
  };

  return (
    <div className="flex-1 bg-[#0F0F12] p-6 md:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto w-full">
      {/* Title Header */}
      <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Interactive Phishing Awareness Trainer</h1>
            <p className="text-xs text-slate-400">Test your detective skills against real-world attack scenarios and learn to spot traps</p>
          </div>
        </div>

        {/* Live Score Tracker */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Score: </span>
          <span className="text-emerald-400 font-bold">{score.correct}</span>
          <span>/</span>
          <span>{score.total}</span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Scenario {currentIndex + 1} of {QUIZ_SCENARIOS.length}</span>
            <span className="flex items-center gap-1.5 font-mono">
              <span>Difficulty:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                scenario.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                scenario.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {scenario.difficulty}
              </span>
            </span>
          </div>

          {/* Email Preview Card */}
          <div className="bg-[#121217] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-[#0E0E11] space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono">Inbound Message Preview</span>
                <span>Today, 10:45 AM</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{scenario.subject}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                <span className="text-slate-400">From:</span>
                <span className="font-bold text-slate-200">{scenario.senderName}</span>
                <span className="text-slate-400">({scenario.sender})</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-[#0A0A0D] text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {scenario.body}
            </div>

            {/* Decision Controls */}
            <div className="p-5 border-t border-slate-800 bg-[#0E0E11] flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold text-slate-300">
                What is your verdict on this email?
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleGuess('safe')}
                  disabled={userAnswer !== null}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    userAnswer === 'safe'
                      ? !scenario.isPhishing
                        ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                        : 'bg-rose-500 text-white ring-2 ring-rose-400'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  } disabled:opacity-80`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Legitimate & Safe</span>
                </button>

                <button
                  onClick={() => handleGuess('phishing')}
                  disabled={userAnswer !== null}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    userAnswer === 'phishing'
                      ? scenario.isPhishing
                        ? 'bg-rose-500 text-white ring-2 ring-rose-400'
                        : 'bg-amber-500 text-slate-950'
                      : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  } disabled:opacity-80`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Phishing Threat</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Explainability & Feedback Reveal */}
          {showExplanation && (
            <div className="bg-[#121217] border border-slate-800 rounded-2xl p-6 space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
              {/* Verdict Header */}
              <div className={`p-4 rounded-xl border flex items-center justify-between ${
                (userAnswer === 'phishing' && scenario.isPhishing) || (userAnswer === 'safe' && !scenario.isPhishing)
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-3">
                  {(userAnswer === 'phishing' && scenario.isPhishing) || (userAnswer === 'safe' && !scenario.isPhishing) ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-bold font-sans">
                      {(userAnswer === 'phishing' && scenario.isPhishing) || (userAnswer === 'safe' && !scenario.isPhishing)
                        ? 'Spot On! You got it right.'
                        : 'Not quite! This was tricky.'}
                    </div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Actual Verdict: {scenario.isPhishing ? '🚨 Phishing Scam' : '✅ Legitimate Email'} • {scenario.threatName}
                    </div>
                  </div>
                </div>
              </div>

              {/* Red Flags Breakdown */}
              {scenario.redFlags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>The Hidden Red Flags in This Email:</span>
                  </div>
                  <div className="space-y-1.5">
                    {scenario.redFlags.map((flag, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                        <span>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plain English Explanation */}
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>How PhishSense AI Analyzes This:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {scenario.explanation}
                </p>
              </div>

              {/* Golden Safety Tip */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-xs text-amber-300">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Golden Rule to Remember:</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {scenario.safeTip}
                </p>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
                >
                  <span>{currentIndex < QUIZ_SCENARIOS.length - 1 ? 'Next Scenario' : 'View Final Score'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Final Score & Graduation Badge */
        <div className="bg-[#121217] border border-slate-800 rounded-2xl p-8 text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Award className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Training Complete!</h2>
            <p className="text-xs text-slate-400">
              You scored <span className="text-emerald-400 font-bold font-mono text-sm">{score.correct} out of {score.total}</span> on the PhishSense AI Challenge.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed">
            {score.correct === score.total ? (
              <span className="text-emerald-400 font-semibold">
                🌟 Perfect 100%! You have the instincts of a senior cybersecurity analyst. You can easily spot deceptive links, CEO spoofing, and artificial urgency.
              </span>
            ) : score.correct >= 3 ? (
              <span className="text-slate-200">
                👍 Great job! You caught most of the traps. Keep remembering the golden rules: never rush on urgent emails and always verify domains.
              </span>
            ) : (
              <span className="text-amber-300">
                📚 Good practice session! Phishing scams are designed to deceive human instincts. Try again to master spotting the subtle clues.
              </span>
            )}
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Practice Lab</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
