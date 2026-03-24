import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentUser, isDatabaseConfigured } from "../../../../lib/auth";
import { connectMongo } from "../../../../lib/mongodb";
import { getModels } from "../../../../lib/mongoose-models";

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  await connectMongo();
  const { Salon } = getModels();
  const salons = await Salon.find().sort({ name: 1 }).lean().exec();

  return NextResponse.json({ salons: salons.map((s) => ({ ...s, _id: String(s._id) })) });
}

export async function POST(request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: "Database neconfigurat." }, { status: 503 });
  }

  const user = await getCurrentUser();

  if (!canAccessAdmin(user)) {
    return NextResponse.json({ error: "Acces refuzat." }, { status: 403 });
  }

  const payload = await request.json();
  const { name, city, theme } = payload;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Numele salonului este obligatoriu." }, { status: 422 });
  }

  await connectMongo();
  const { Salon } = getModels();

  const baseSlug = slugify(name.trim());
  let slug = baseSlug;
  let attempt = 0;

  while (await Salon.exists({ slug })) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  const salon = await Salon.create({
    slug,
    name: name.trim(),
    city: city?.trim() || "",
    theme: theme?.trim() || "classic",
    confidentialityScope: "tenant-isolated",
    adminIds: [],
    professionalIds: []
  });

  return NextResponse.json(
    {
      ok: true,
      salon: { ...salon.toObject(), _id: String(salon._id) }
    },
    { status: 201 }
  );
}
