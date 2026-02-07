
import React from 'react';
import MapControls from './MapControls';

const MapArea: React.FC = () => {
    return (
        <>
            <div id="map-capture" className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to bottom, rgba(16, 34, 21, 0.3), rgba(16, 34, 21, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuANmjHi7tM63wBzp0-cZnh1dclhdRY6op2TPGlonSDTbwUoJOEWQO7k9XB-08lBYSZqvT67HrW92Q8hmHnEew6eZhPzlO22Sne5NTQ74vXFt1oWVijkAx2ZDodetLJJBDxJJ_yz0Kya4MKCgL5HewRSWo96VUITr0r-NVDptxwf0cTyNMS-JK265tNDTsFEuAoHCCszKL-umJidqSM2bdoC37YQidNogXmJW9jY5chyISGno-GJUWd6yOhCmW2uUFa-CrO0hvjL_iFH')" }}>
                <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ background: "radial-gradient(circle at 60% 40%, rgba(255, 69, 0, 0.8), transparent 40%), radial-gradient(circle at 30% 70%, rgba(255, 140, 0, 0.6), transparent 50%)" }}></div>
            </div>
            
            <div className="absolute top-0 right-0 p-6 h-full flex flex-col items-end pointer-events-none">
                <MapControls />
            </div>

            {/* Simulated Map Markers */}
            <div className="absolute top-[40%] left-[55%] z-0 pointer-events-none">
                <div className="relative group">
                    <div className="absolute -top-12 -left-6 bg-primary/90 text-background-dark text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-auto">
                        Tree #12 (+4% Shade)
                    </div>
                    <div className="h-16 w-16 bg-contain bg-no-repeat bg-center drop-shadow-2xl" style={{ 
                        backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDlLJIoX_3yCpRU7cJysYPoKmnPaWWvQFzoGMx5FG9QRuRt5exJ0Nc9R01k0VkpK2yS_mv2-EEpdSc49cd6QYNxqMDD36PuWWiqG58GugD9EeoExXZ6W34zZBiuQg8WpSbDHCKwaN2KeGEdEdoVp6-PAKdPvfkAoLdjhhXDSw6l94kwGW_ap0ijoGO39qlPXg5Kq97oXAxc0UFX2MKBwuAZSBT2fV1GialWFo8uf4MwxTNozUTXo6lV1Ke6HZb32JpzK4OWR6y8uaH8')",
                        WebkitMask: "url('https://fonts.gstatic.com/s/i/materialicons/park/v6/24px.svg') no-repeat center",
                        mask: "url('https://fonts.gstatic.com/s/i/materialicons/park/v6/24px.svg') no-repeat center",
                        backgroundColor: "#13ec49"
                     }}></div>
                </div>
            </div>
            <div className="absolute top-[60%] left-[35%] z-0 pointer-events-none opacity-80">
                <div className="h-12 w-12 bg-contain bg-no-repeat bg-center drop-shadow-2xl" style={{ 
                    backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCq_nTgUx3TPyKKARm24Mm1KnhC0kt-UR5QlwhN101a5a2vKy5wBD9kKgsroUPl_kETIAKrKS9wF4f8-H5fWBMJVY1-sLC04ts5YSHadmibC2WiNkB8BLtNaERCQ0-S_m9jrPRNzy49W5-MN6QGAhb3SY6RfzER9EdLbFjQ6t3MNcTzy-i3WHqBR9gtoBtxIP24raA7Yrt5ezQ8BoVxKVHe61yLf_JaHiXkKVAtnC_0K7Rv_KFtr6_CtvNtZm8KIAM4LYD6wgx9h_Oc')",
                    WebkitMask: "url('https://fonts.gstatic.com/s/i/materialicons/park/v6/24px.svg') no-repeat center",
                    mask: "url('https://fonts.gstatic.com/s/i/materialicons/park/v6/24px.svg') no-repeat center",
                    backgroundColor: "#13ec49"
                 }}></div>
            </div>
        </>
    );
};

export default MapArea;
