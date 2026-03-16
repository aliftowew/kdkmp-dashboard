import streamlit as st
import matplotlib.pyplot as plt
import numpy as np

# --- SETTING HALAMAN ---
st.set_page_config(page_title="Dashboard KDKMP", layout="wide")

# --- KONSTANTA MATEMATIKA ---
POP_PER_KDKMP = 13070
E_FOOD = 753800
MULTIPLIER_K = 1.934
POVERTY_GAP = 36.2
AWAL_GINI = 0.37
PDB_NASIONAL_2025 = 23821.1

# --- JUDUL & SLIDER (HEMAT TEMPAT DI ATAS) ---
st.markdown("<h2 style='text-align: center;'>⚡ Dashboard Simulasi Ekonomi KDKMP</h2>", unsafe_allow_html=True)

col_s1, col_s2, col_s3, col_s4 = st.columns(4)
with col_s1:
    pangsa_pasar = st.slider("🛒 Pangsa Pasar (%)", min_value=0, max_value=100, value=30, step=5)
with col_s2:
    diskon = st.slider("🏷️ Diskon Sembako (%)", min_value=0, max_value=15, value=2, step=1)
with col_s3:
    margin = st.slider("📈 Margin KDKMP (%)", min_value=5, max_value=15, value=10, step=1)
with col_s4:
    jumlah_kdkmp = st.slider("🏪 Jumlah KDKMP", min_value=1, max_value=83762, value=83762, step=1000)

st.markdown("---")

# --- KALKULASI MATEMATIKA ---
s = pangsa_pasar / 100
d = diskon / 100
m = margin / 100

omzet_tahunan = POP_PER_KDKMP * E_FOOD * 12 * s * jumlah_kdkmp
penghematan_diskon = omzet_tahunan * d

total_margin = omzet_tahunan * m
shu_bottom40 = total_margin * 0.82
shu_desa = total_margin * 0.15
shu_pusat = total_margin * 0.03

tambahan_daya_beli = penghematan_diskon + shu_bottom40
tambahan_pdb = tambahan_daya_beli * MULTIPLIER_K

# Konversi ke Triliun
pdb_t = tambahan_pdb / 1e12
persen_pdb = (pdb_t / PDB_NASIONAL_2025) * 100
db_t = tambahan_daya_beli / 1e12
diskon_t = penghematan_diskon / 1e12
shu_b40_t = shu_bottom40 / 1e12
shu_desa_t = shu_desa / 1e12
shu_pusat_t = shu_pusat / 1e12
omzet_t = omzet_tahunan / 1e12

# Dampak Sosial
persen_miskin = min(100.0, (db_t / POVERTY_GAP) * 100)
gini_drop = min(0.08, (db_t / 2000) * 0.08)
new_gini = max(0.20, AWAL_GINI - gini_drop)


# --- BARIS 1: 2 KOTAK SEJAJAR (MAKRO & SOSIAL) ---
col_makro, col_sosial = st.columns(2)

with col_makro:
    with st.container(border=True):
        st.markdown("#### 💰 Dampak Makroekonomi")
        m1, m2, m3 = st.columns(3)
        m1.metric(label="Tambahan PDB", value=f"+ Rp {pdb_t:,.1f} T")
        m2.metric(label="Ke PDB 2025", value=f"+ {persen_pdb:.2f}%")
        m3.metric(label="Daya Beli Baru", value=f"Rp {db_t:,.1f} T")

with col_sosial:
    with st.container(border=True):
        st.markdown("#### 🤝 Dampak Sosial")
        s1, s2, s3 = st.columns(3)
        s1.metric(label="Poverty Gap Tutup", value=f"{persen_miskin:.1f}%")
        s2.metric(label="Gini Baru", value=f"{new_gini:.3f}", delta=f"-{gini_drop:.3f}", delta_color="inverse")
        s3.metric(label="Gini Awal", value=f"{AWAL_GINI}")


# --- BARIS 2: 1 KOTAK & 1 GRAFIK SEJAJAR ---
col_ops, col_grafik = st.columns([1, 1.8]) # Grafik diberi ruang sedikit lebih lebar

with col_ops:
    with st.container(border=True):
        st.markdown("#### 📊 Rincian Operasional")
        st.metric(label="KDKMP Aktif", value=f"{jumlah_kdkmp:,} Titik")
        st.metric(label="Omzet Nasional", value=f"Rp {omzet_t:,.1f} T")
        st.metric(label="Uang Muter di Desa", value=f"Rp {(shu_b40_t + shu_desa_t):,.1f} T")

with col_grafik:
    with st.container(border=True):
        st.markdown("#### 📈 Distribusi Nilai (Triliun Rupiah)")
        fig, ax = plt.subplots(figsize=(8, 3.2)) # Ukuran grafik diperkecil agar tidak memakan layar
        labels = ['Penghematan', 'SHU Warga', 'SHU Desa', 'SHU Pusat']
        values = [diskon_t, shu_b40_t, shu_desa_t, shu_pusat_t]
        colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c']

        bars = ax.bar(labels, values, color=colors, width=0.5)
        ax.set_ylim(0, 1500)
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'Rp {height:,.1f} T',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3), textcoords="offset points",
                        ha='center', va='bottom', fontweight='bold', fontsize=9)

        st.pyplot(fig, use_container_width=True)
