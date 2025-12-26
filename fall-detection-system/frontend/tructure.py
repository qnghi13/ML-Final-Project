import os

def print_tree(startpath, prefix=""):
    """
    Hàm đệ quy để in cấu trúc thư mục
    """
    # Các thư mục hoặc file muốn bỏ qua (nếu cần)
    IGNORE_LIST = {'.git', 'node_modules', '__pycache__', '.DS_Store'}

    # Kiểm tra đường dẫn có tồn tại không
    if not os.path.exists(startpath):
        print(f"❌ Đường dẫn không tồn tại: {startpath}")
        return

    # Lấy danh sách tất cả file và folder
    try:
        entries = os.listdir(startpath)
    except PermissionError:
        return

    # Lọc bỏ các file/folder trong IGNORE_LIST
    entries = [e for e in entries if e not in IGNORE_LIST]
    
    # Sắp xếp: Folder lên trước, File ra sau (giống VS Code)
    entries.sort(key=lambda x: (not os.path.isdir(os.path.join(startpath, x)), x.lower()))

    total = len(entries)
    
    for i, entry in enumerate(entries):
        # Xác định đây là phần tử cuối cùng hay chưa để chọn ký tự nối
        connector = "└── " if i == total - 1 else "├── "
        
        # Tạo đường dẫn đầy đủ
        full_path = os.path.join(startpath, entry)
        
        # Kiểm tra là Folder hay File để thêm icon cho sinh động
        if os.path.isdir(full_path):
            print(f"{prefix}{connector}📂 {entry}")
            # Tính toán prefix cho cấp con
            extension = "    " if i == total - 1 else "│   "
            # Đệ quy vào bên trong folder
            print_tree(full_path, prefix + extension)
        else:
            print(f"{prefix}{connector}📄 {entry}")

if __name__ == "__main__":
    # --- CẤU HÌNH ĐƯỜNG DẪN TẠI ĐÂY ---
    # Thay đổi đường dẫn này trỏ tới thư mục src của bạn
    # Ví dụ: "./frontend/src" hoặc đơn giản là "src" nếu để file py bên trong frontend
    target_dir = "./src" 

    print(f"📦 Cấu trúc thư mục: {target_dir}\n")
    print(target_dir)
    print_tree(target_dir)