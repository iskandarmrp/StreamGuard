from chat_downloader import ChatDownloader
import csv

# Link Video Live Stream
url_video = 'https://www.youtube.com/live/zzDtTiE71q0?si=8T8GZx_VkPVEqH6j'

# File Name
nama_file_csv = 'data_scraping/data_chat_youtube.csv'

print(f"Memulai proses scraping dari: {url_video}")
print("Tekan CTRL+C jika ingin menghentikan proses secara paksa.\n")

# Open CSV File
with open(nama_file_csv, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(['Waktu', 'Username', 'Pesan'])
    
    pesan_terkumpul = 0
    
    try:
        # ChatDownloader
        chat = ChatDownloader().get_chat(url_video)

        for message in chat:
            waktu = message.get('time_text', '')
            username = message['author']['name']
            teks_pesan = message['message']
            
            # Save message
            writer.writerow([waktu, username, teks_pesan])
            
            pesan_terkumpul += 1

            print(f"[{waktu}] {username}: {teks_pesan}")
            
            # Max 30000 messages
            if pesan_terkumpul >= 30000:
                print("\n[Batas 30000 pesan tercapai. Berhenti.]")
                break
                
    except Exception as e:
        print(f"\nTerjadi kesalahan: {e}")

print(f"\nSelesai! Berhasil mengumpulkan {pesan_terkumpul} pesan.")
print(f"Data telah disimpan di file: {nama_file_csv}")