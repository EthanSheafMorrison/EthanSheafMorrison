// Initialize EasyMDE
let easyMDE;
document.addEventListener('DOMContentLoaded', function() {
    easyMDE = new EasyMDE({
        element: document.getElementById('post-content'),
        spellChecker: false,
        status: false,
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ]
    });
});

// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    const postForm = document.getElementById('post-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const categoryFilter = document.getElementById('category-filter');
    const imageInput = document.getElementById('post-image');
    const imagePreview = document.getElementById('image-preview');
    
    // Load existing posts
    loadPosts();
    
    // Handle image preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('post-title').value;
        const date = document.getElementById('post-date').value;
        const category = document.getElementById('post-category').value;
        const tags = document.getElementById('post-tags').value.split(',').map(tag => tag.trim());
        const content = easyMDE.value();
        const image = imageInput.files[0];
        const isDraft = e.submitter.id === 'save-draft';
        
        // Create new post
        const newPost = {
            id: Date.now().toString(),
            title: title,
            date: date,
            category: category,
            tags: tags,
            content: content,
            isDraft: isDraft
        };
        
        // Handle image upload
        if (image) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newPost.image = e.target.result;
                savePost(newPost);
                postForm.reset();
                imagePreview.innerHTML = '';
                easyMDE.value('');
                loadPosts();
            };
            reader.readAsDataURL(image);
        } else {
            savePost(newPost);
            postForm.reset();
            imagePreview.innerHTML = '';
            easyMDE.value('');
            loadPosts();
        }
    });
    
    // Handle search
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase();
        filterPosts(searchTerm, categoryFilter.value);
    });
    
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            filterPosts(searchTerm, categoryFilter.value);
        }
    });
    
    // Handle category filter
    categoryFilter.addEventListener('change', function() {
        const searchTerm = searchInput.value.toLowerCase();
        filterPosts(searchTerm, this.value);
    });
});

// Load posts from localStorage
function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Clear container
    postsContainer.innerHTML = '';
    
    // Add each post
    posts.forEach(post => {
        if (!post.isDraft) {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        }
    });
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.dataset.id = post.id;
    
    const title = document.createElement('h2');
    title.className = 'post-title';
    title.textContent = post.title;
    
    const meta = document.createElement('div');
    meta.className = 'post-meta';
    
    const category = document.createElement('span');
    category.className = 'post-category';
    category.textContent = post.category;
    
    const date = document.createElement('span');
    date.className = 'post-date';
    date.textContent = formatDate(post.date);
    
    const tags = document.createElement('div');
    tags.className = 'post-tags';
    post.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'post-tag';
        tagSpan.textContent = tag;
        tags.appendChild(tagSpan);
    });
    
    const content = document.createElement('div');
    content.className = 'post-content';
    content.innerHTML = marked.parse(post.content);
    
    const actions = document.createElement('div');
    actions.className = 'post-actions';
    
    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editPost(post.id));
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deletePost(post.id));
    
    meta.appendChild(category);
    meta.appendChild(date);
    meta.appendChild(tags);
    
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    
    postDiv.appendChild(actions);
    postDiv.appendChild(title);
    postDiv.appendChild(meta);
    
    if (post.image) {
        const image = document.createElement('img');
        image.className = 'post-image';
        image.src = post.image;
        image.alt = post.title;
        postDiv.appendChild(image);
    }
    
    postDiv.appendChild(content);
    
    return postDiv;
}

// Save post to localStorage
function savePost(post) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex !== -1) {
        posts[existingIndex] = post;
    } else {
        posts.push(post);
    }
    
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

// Edit post
function editPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-date').value = post.date;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-tags').value = post.tags.join(', ');
        easyMDE.value(post.content);
        
        if (post.image) {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.innerHTML = `<img src="${post.image}" alt="Preview">`;
        }
        
        // Remove the old post
        deletePost(postId);
    }
}

// Delete post
function deletePost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    const filteredPosts = posts.filter(p => p.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
    loadPosts();
}

// Filter posts by search term and category
function filterPosts(searchTerm, category) {
    const postsContainer = document.getElementById('posts-container');
    const posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
    
    // Clear container
    postsContainer.innerHTML = '';
    
    // Filter and add posts
    posts
        .filter(post => {
            const matchesSearch = !searchTerm || 
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesCategory = !category || post.category === category;
            
            return matchesSearch && matchesCategory && !post.isDraft;
        })
        .forEach(post => {
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
        });
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
} 