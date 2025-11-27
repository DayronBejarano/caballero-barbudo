-- CreateTable
CREATE TABLE "Barbero" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "fotoUrl" TEXT NOT NULL DEFAULT '/img/logo.png',
    "bio" TEXT,
    "password" TEXT NOT NULL DEFAULT '1234',
    "rol" TEXT NOT NULL DEFAULT 'STAFF',

    CONSTRAINT "Barbero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portafolio" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "barberoId" INTEGER NOT NULL,

    CONSTRAINT "Portafolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL,
    "clienteNombre" TEXT NOT NULL,
    "clienteTelefono" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tokenCancelacion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'CONFIRMADA',
    "precio" INTEGER NOT NULL DEFAULT 20000,
    "barberoId" INTEGER NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barbero_nombre_key" ON "Barbero"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Cita_tokenCancelacion_key" ON "Cita"("tokenCancelacion");

-- AddForeignKey
ALTER TABLE "Portafolio" ADD CONSTRAINT "Portafolio_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_barberoId_fkey" FOREIGN KEY ("barberoId") REFERENCES "Barbero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
