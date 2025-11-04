import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
// Optional YouTube video URLs; set these to embed videos on the page
const VIDEO_WHO_WE_ARE = "https://www.youtube.com/watch?v=Oj2jJdNu57k"; // e.g. https://www.youtube.com/embed/XXXXXXXX
const VIDEO_OUTREACH_LOOKS_LIKE = "https://youtu.be/G11gADLw8F4?si=lJGi-kP3QNizAMAI"; // e.g. https://www.youtube.com/embed/YYYYYYYY

// Convert common YouTube URLs (watch, youtu.be, shorts) to an embeddable URL
function toYouTubeEmbed(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    // youtu.be/<id>
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // www.youtube.com/watch?v=<id>
    if (u.hostname.includes("youtube.com")) {
      // shorts/<id>
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      // already /embed/<id>
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch (_) {
    return null;
  }
  return null;
}

const unitOptions = [
  "Music",
  "Children/Teenagers",
  "Cosmetology (Barbing & Plaiting)",
  "Counselling",
  "Drama",
  "Kitchen",
  "Prayer",
  "Media",
  "Transport & Organising",
  "Technical",
  "Skills Acquisition",
  "Ushering",
  "Medical",
  "Welfare",
] as const;

const schema = z
  .object({
    email: z.string().email("Enter a valid email"),
    firstName: z.string().min(1, "First name is required"),
    surname: z.string().min(1, "Surname is required"),
    otherName: z.string().optional(),
    dob: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female"], { required_error: "Gender is required" }),
    maritalStatus: z.enum(
      ["Single", "Married", "Widow/widower", "Divorced/Separated"],
      { required_error: "Marital status is required" }
    ),
    phonePrimary: z.string().min(6, "Enter a valid phone number"),
    phoneNIN: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    church: z.string().min(1, "Church is required"),
    bornAgainYear: z
      .string()
      .min(4, "Enter a valid year")
      .regex(/^\d{4}$/g, "Enter a 4-digit year"),
    baptisedHolySpirit: z.enum(["Yes", "No"], {
      required_error: "Please select an option",
    }),
    priorOutreach: z.enum(["Yes", "No"], {
      required_error: "Please select an option",
    }),
    unit: z.enum(unitOptions, { required_error: "Please select a unit" }),
    membership: z.enum(["Yes", "Uncertain"], {
      required_error: "Please select an option",
    }),
    financialPartner: z.enum(["Yes", "No", "Uncertain"], {
      required_error: "Please select an option",
    }),
    supportAmount: z.string().optional(),
    frequency: z
      .enum(["Monthly", "Quarterly", "Every 6 Months", "Yearly", "Other"] as const)
      .optional(),
    frequencyOther: z.string().optional(),
    callSense: z.string().min(1, "This field is required"),
    rulesAgreement: z.enum(["Yes, I agree", "No, I Disagree"], {
      required_error: "Please confirm your agreement",
    }),
    comments: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.financialPartner === "Yes") {
      if (!data.supportAmount || data.supportAmount.trim() === "") {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["supportAmount"], message: "Please specify an amount" });
      }
      if (!data.frequency) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frequency"], message: "Please select a frequency" });
      }
      if (data.frequency === "Other" && (!data.frequencyOther || data.frequencyOther.trim() === "")) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["frequencyOther"], message: "Please specify the frequency" });
      }
    }
    if (data.rulesAgreement !== "Yes, I agree") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["rulesAgreement"], message: "You must agree to proceed" });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      financialPartner: "Uncertain",
    },
  });

  const financialPartner = watch("financialPartner");
  const frequency = watch("frequency");

  const onSubmit = async (values: FormValues) => {
    const scriptURL = `https://script.google.com/macros/s/${import.meta.env.VITE_SHEET_API_KEY}/exec`


    // Placeholder: wire to Supabase or EmailJS here
    // For now, just log and toast success
    const response = await fetch(scriptURL, { method: 'POST', body: JSON.stringify({ ...values }) })
    console.log(response)
    if (response.ok) {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Registration submitted. We'll be in touch soon!");
      reset();
    } else {
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">2025 Mission Outreach Registration</h1>
        <p className="mt-2 text-gray-700">Amadaka Community, Eastern Obolo Local Government Area of Akwa Ibom State.</p>
        <p className="text-gray-700">Sunday 22nd – Thursday 26th December, 2025</p>
        <div className="mt-3 inline-block bg-red-600 text-white text-sm px-3 py-1 rounded-full">
          Registration Starting on mon, 27th October 2025.  then closing on 8th November 2025.
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Email */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" className="w-full border rounded-lg px-3 py-2" {...register("email")} />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
        </section>

        {/* Who We Are video */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Who We Are in 25 seconds</h2>
          {toYouTubeEmbed(VIDEO_WHO_WE_ARE) ? (
            <div className="aspect-video w-full">
              <iframe className="w-full h-full rounded-lg" src={toYouTubeEmbed(VIDEO_WHO_WE_ARE) as string} title="Who We Are" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Provide a YouTube embed URL to display the video.</p>
          )}
        </section>

        {/* Personal names & DOB */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("firstName")} />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Surname *</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("surname")} />
              {errors.surname && <p className="text-red-600 text-sm mt-1">{errors.surname.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Other Name</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("otherName")} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth *</label>
              <input type="date" className="w-full border rounded-lg px-3 py-2" {...register("dob")} />
              {errors.dob && <p className="text-red-600 text-sm mt-1">{errors.dob.message}</p>}
            </div>
          </div>
        </section>

        {/* Gender & Marital Status */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gender *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="radio" value="Male" {...register("gender")} /> Male</label>
                <label className="flex items-center gap-2"><input type="radio" value="Female" {...register("gender")} /> Female</label>
              </div>
              {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Marital Status *</label>
              <div className="space-y-2">
                {(["Single", "Married", "Widow/widower", "Divorced/Separated"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-2"><input type="radio" value={m} {...register("maritalStatus")} /> {m}</label>
                ))}
              </div>
              {errors.maritalStatus && <p className="text-red-600 text-sm mt-1">{errors.maritalStatus.message as string}</p>}
            </div>
          </div>
        </section>

        {/* Phones, Address, Church, Born Again Year */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number *</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("phonePrimary")} />
              {errors.phonePrimary && <p className="text-red-600 text-sm mt-1">{errors.phonePrimary.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number (linked to your NIN, if different)</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("phoneNIN")} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Address (where do you live?) *</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("address")} />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Church *</label>
              <input className="w-full border rounded-lg px-3 py-2" {...register("church")} />
              {errors.church && <p className="text-red-600 text-sm mt-1">{errors.church.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Which Year were you born again? *</label>
              <input className="w-full border rounded-lg px-3 py-2" placeholder="e.g., 2012" {...register("bornAgainYear")} />
              {errors.bornAgainYear && <p className="text-red-600 text-sm mt-1">{errors.bornAgainYear.message}</p>}
            </div>
          </div>
        </section>

        {/* Spiritual status & prior outreach */}
        <section className="bg-white p-6 rounded-xl shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Are you baptised in the Holy Spirit? *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="radio" value="No" {...register("baptisedHolySpirit")} /> No</label>
                <label className="flex items-center gap-2"><input type="radio" value="Yes" {...register("baptisedHolySpirit")} /> Yes</label>
              </div>
              {errors.baptisedHolySpirit && <p className="text-red-600 text-sm mt-1">{errors.baptisedHolySpirit.message as string}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Have you been to Mission outreach before? *</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2"><input type="radio" value="Yes" {...register("priorOutreach")} /> Yes</label>
                <label className="flex items-center gap-2"><input type="radio" value="No" {...register("priorOutreach")} /> No</label>
              </div>
              {errors.priorOutreach && <p className="text-red-600 text-sm mt-1">{errors.priorOutreach.message as string}</p>}
            </div>
          </div>
        </section>

        {/* Unit selection */}
        <section className="bg-white p-6 rounded-xl shadow">
          <label className="block text-sm font-medium mb-2">Which Unit do you like to Join during the outreach? *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {unitOptions.map((u) => (
              <label key={u} className="flex items-center gap-2"><input type="radio" value={u} {...register("unit")} /> {u}</label>
            ))}
          </div>
          {errors.unit && <p className="text-red-600 text-sm mt-1">{errors.unit.message as string}</p>}
        </section>

        {/* Membership & Financial Partner */}
        <section className="bg-white p-6 rounded-xl shadow space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Membership (Do you want to be a registered Member of Reachout To All?) *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="radio" value="Yes" {...register("membership")} /> Yes</label>
              <label className="flex items-center gap-2"><input type="radio" value="Uncertain" {...register("membership")} /> Uncertain</label>
            </div>
            {errors.membership && <p className="text-red-600 text-sm mt-1">{errors.membership.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Financial Partner (Do you want to be a financial partner to Reachout To All?) *</label>
            <div className="space-y-2">
              {(["Yes", "No", "Uncertain"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2"><input type="radio" value={v} {...register("financialPartner")} /> {v}</label>
              ))}
            </div>
            {errors.financialPartner && <p className="text-red-600 text-sm mt-1">{errors.financialPartner.message as string}</p>}
          </div>

          {financialPartner === "Yes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">If yes, how much do you want to support with?</label>
                <input className="w-full border rounded-lg px-3 py-2" placeholder="e.g., ₦10,000" {...register("supportAmount")} />
                {errors.supportAmount && <p className="text-red-600 text-sm mt-1">{errors.supportAmount.message as string}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Frequency (how often do you wish to make this financial support?)</label>
                <select className="w-full border rounded-lg px-3 py-2" {...register("frequency")}>
                  <option value="">Select...</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Every 6 Months</option>
                  <option>Yearly</option>
                  <option>Other</option>
                </select>
                {errors.frequency && <p className="text-red-600 text-sm mt-1">{errors.frequency.message as string}</p>}
              </div>
              {frequency === "Other" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">If others, how often do you want to make this financial support?</label>
                  <input className="w-full border rounded-lg px-3 py-2" {...register("frequencyOther")} />
                  {errors.frequencyOther && <p className="text-red-600 text-sm mt-1">{errors.frequencyOther.message as string}</p>}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Call sense */}
        <section className="bg-white p-6 rounded-xl shadow">
          <label className="block text-sm font-medium mb-1">What (do you sense) is your call? *</label>
          <input className="w-full border rounded-lg px-3 py-2" {...register("callSense")} />
          {errors.callSense && <p className="text-red-600 text-sm mt-1">{errors.callSense.message}</p>}
        </section>

        {/* Agreement */}
        <section className="bg-white p-6 rounded-xl shadow">
          <p className="font-medium mb-2">I undertake to abide by all the rules governing the Outreach, so help me God. Amen. *</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2"><input type="radio" value="Yes, I agree" {...register("rulesAgreement")} /> Yes, I agree</label>
            <label className="flex items-center gap-2"><input type="radio" value="No, I Disagree" {...register("rulesAgreement")} /> No, I Disagree</label>
          </div>
          {errors.rulesAgreement && <p className="text-red-600 text-sm mt-1">{errors.rulesAgreement.message as string}</p>}
        </section>

        {/* Suggestion/Comment */}
        <section className="bg-white p-6 rounded-xl shadow">
          <label className="block text-sm font-medium mb-1">Suggestion/Comment if any</label>
          <textarea rows={3} className="w-full border rounded-lg px-3 py-2" {...register("comments")} />
        </section>

        {/* Watch what outreach looks like video */}
        <section className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Watch what outreach looks like</h2>
          {toYouTubeEmbed(VIDEO_OUTREACH_LOOKS_LIKE) ? (
            <div className="aspect-video w-full">
              <iframe className="w-full h-full rounded-lg" src={toYouTubeEmbed(VIDEO_OUTREACH_LOOKS_LIKE) as string} title="Outreach Overview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          ) : (
            <p className="text-sm text-gray-600">Provide a YouTube embed URL to display the video.</p>
          )}
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Fields marked with * are required.</p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </button>
        </div>
      </form>
    </div>
  );
}
