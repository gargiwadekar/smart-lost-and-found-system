import nodemailer from "nodemailer";

const canSendEmail = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendMatchVerificationEmail = async ({
  to,
  approvalToken,
  foundItem,
  lostItem,
  verificationAnswers = {},
}) => {
  if (!canSendEmail() || !to) return;

  const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";
  const verifyUrl = `${baseUrl}/api/match/verify/${approvalToken}`;

  await createTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Lost and Found Claim Verification",
    html: `
      <h2>Claim verification requested</h2>
      <p>Someone says this found item belongs to them: <strong>${foundItem.itemName}</strong>.</p>
      <p><strong>Lost item:</strong> ${lostItem?.itemName || "Not provided"}</p>
      <p><strong>Color:</strong> ${verificationAnswers.color || "Not provided"}</p>
      <p><strong>Brand:</strong> ${verificationAnswers.brand || "Not provided"}</p>
      <p><strong>Unique mark:</strong> ${verificationAnswers.uniqueMark || "Not provided"}</p>
      <p>Please approve the claim only if it looks genuine.</p>
      <a href="${verifyUrl}">Approve and share collection details</a>
    `,
  });
};

export const sendClaimApprovedEmail = async ({ to, foundItem, lostItem }) => {
  if (!canSendEmail() || !to) return;

  await createTransporter().sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your lost item claim was approved",
    html: `
      <h2>Your claim was approved</h2>
      <p>The found user approved your claim for <strong>${lostItem?.itemName || foundItem.itemName}</strong>.</p>
      <p><strong>Collection details:</strong> ${foundItem.collectionInfo || "No collection details provided"}</p>
    `,
  });
};
