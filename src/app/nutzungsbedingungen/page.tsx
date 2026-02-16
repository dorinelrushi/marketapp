import React from 'react';

export default function Nutzungsbedingungen() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-16 lg:py-24">
            <h1 className="text-[22px] md:text-4xl font-black text-black mb-4 uppercase tracking-tighter font-display">
                NUTZUNGSBEDINGUNGEN
            </h1>
            <h2 className="text-[17px] lg:text-[25px] md:text-2xl mb-8 t">
                Zahlungs- und Jahresabonnementrichtlinien
            </h2>

            <div className="bg-zinc-50 border border-zinc-100 rounded-[32px] p-8 md:p-12 mb-16">
                <p className="text-zinc-500 mb-10 leading-relaxed font-medium text-[15px]">
                    Diese Seite legt die Bedingungen fest, die für die Nutzung unserer Immobilien-Buchungsplattform gelten, einschließlich der Erstanmeldung, des Jahresabonnements und der automatischen Verlängerung.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                        <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Anfängliche Zahlung</span>
                        <span className="text-2xl font-black text-black uppercase tracking-tighter">0,99 € bei Registrierung</span>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm">
                        <span className="block text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Automatische Abrechnung</span>
                        <span className="text-2xl font-black text-black uppercase tracking-tighter">49,99 € nach 24 Stunden</span>
                    </div>
                </div>
            </div>

            <div className=" text-zinc-500 leading-relaxed font-medium">
                <section >
                    <h3 className="text-[18px] font-black text-black mb-6 flex  flex-wrap items-center gap-4 uppercase tracking-tight">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-black">1</span>
                        Annahme der Bedingungen
                    </h3>
                    <p className="mb-[29px]">
                        Durch die Registrierung und Nutzung unserer Plattform für die Buchung von Immobilien akzeptiert der Nutzer diese Nutzungsbedingungen vollständig, einschließlich der unten beschriebenen Zahlungs- und Abonnementrichtlinien.
                    </p>
                </section>

                <section>
                    <h3 className="text-[18px] font-black text-black mb-6 flex flex-wrap items-center gap-4 uppercase tracking-tight">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-black">2</span>
                        Anfängliche Registrierungsgebühr (0,99 €)
                    </h3>
                    <div className="mb-[29px]">
                        <p>2.1. Um das Konto zu aktivieren und Zugang zu den Diensten der Plattform zu erhalten, muss der Nutzer eine anfängliche Zahlung von 0,99 Euro leisten.</p>
                        <p>2.2. Diese Zahlung gilt als Registrierungs- und Verifizierungsgebühr für das Konto.</p>
                        <p>2.3. Die Zahlung von 0,99 €:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Ist nicht erstattungsfähig.</li>
                            <li>Wird nur einmal zum Zeitpunkt der Erstanmeldung fällig.</li>
                            <li>Dient zur Aktivierung des ersten Zugangs zum System.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-black text-black mb-6 flex flex-wrap  items-center gap-4 uppercase tracking-tight">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-black">3</span>
                        Jahresabonnementgebühr (49,99 €)
                    </h3>
                    <div className="mb-[29px]">
                        <p>3.1. Innerhalb von 24 Stunden nach der Registrierung wird dem Nutzer automatisch der Betrag von 49,99 Euro in Rechnung gestellt.</p>
                        <p>3.2. Dieser Betrag stellt die Gebühr für das vollständige Jahresabonnement zur Nutzung des Immobilien-Buchungsservices dar.</p>
                        <p>3.3. Das Jahresabonnement beinhaltet:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Vollständigen Zugriff auf Immobilienangebote.</li>
                            <li>Möglichkeit zur Durchführung von Buchungen.</li>
                            <li>Kundensupport während der gesamten Abonnementdauer.</li>
                            <li>Nutzung der Plattform für 12 Monate ab dem Rechnungsdatum.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-black text-black mb-6 flex flex-wrap  items-center gap-4 uppercase tracking-tight">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-black">4</span>
                        Autorisierung automatischer Zahlungen
                    </h3>
                    <div className="mb-[29px]">
                        <p>4.1. Durch die Leistung der anfänglichen Zahlung von 0,99 Euro autorisiert der Nutzer die Plattform zu Folgendem:</p>
                        <ul className="list-disc  text-sm">
                            <li>Automatische Belastung der registrierten Karte/Zahlungsmethode nach 24 Stunden mit dem Betrag von 49,99 Euro.</li>
                            <li>Automatische Verlängerung des Abonnements alle 12 Monate zum gleichen Betrag, sofern der Nutzer nicht vor dem Verlängerungsdatum kündigt.</li>
                        </ul>
                        <p>4.2. Der Nutzer ist dafür verantwortlich, sicherzustellen, dass die Zahlungsdaten korrekt und gültig sind.</p>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-black text-black mb-6 flex flex-wrap  items-center gap-4 uppercase tracking-tight">
                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-sm font-black">7</span>
                        Kündigung des Abonnements
                    </h3>
                    <div className="mb-[29px]">
                        <p>7.1. Der Nutzer kann das Abonnement jederzeit über das Kontopanel kündigen.</p>
                        <p>7.2. Die Kündigung wird am Ende des aktuellen Abonnementzeitraums wirksam.</p>
                        <p>7.3. Die Kündigung storniert keine zuvor geleisteten Zahlungen und garantiert keine Rückerstattung.</p>
                    </div>
                </section>
            </div>

            <div className="mt-24 p-12 bg-black rounded-[40px] text-white">
                <h3 className="text-2xl font-black mb-8 uppercase tracking-tight">Schnelle Zusammenfassung</h3>
                <ul className="space-y-6">
                    <li className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <span className="text-zinc-300 font-bold">Registrierung wird mit <span className="text-white">0,99 Euro</span> aktiviert.</span>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <span className="text-zinc-300 font-bold">Nach 24 Stunden werden <span className="text-white">49,99 Euro</span> fällig.</span>
                    </li>
                    <li className="flex items-center gap-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                        <span className="text-zinc-300 font-bold">Das Abonnement läuft 12 Monate und verlängert sich automatisch.</span>
                    </li>
                </ul>
                <div className="mt-12 pt-8 border-t border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Durch das Lesen der Seite „Bedingungen akzeptieren“ bestätigt der Nutzer die Annahme.
                </div>
            </div>
        </div >
    );
}
