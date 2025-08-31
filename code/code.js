    let form = document.getElementById("createblog");
    const blogContainer = document.getElementById("div");

    function showAllBlogs(){
      form.classList.add("deactive");
      blogContainer.innerHTML = '';
      allblog();
    }

    function showCreateBlogForm(){
      form.classList.remove("deactive");
      blogContainer.innerHTML = '';
    }

    // Create Blog
    form.addEventListener('submit', (eve)=>{
      eve.preventDefault();
      let title = document.getElementById("title").value.trim();
      let Author = document.getElementById("Author").value.trim();
      let Content = document.getElementById("Content").value.trim();
      const data = {title, author: Author, content: Content};

      const createblog = async(data)=>{
        try{
          const option = {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(data)
          }
          const response = await fetch("https://ewl-server.vercel.app/api/v1/blog/create", option);
          console.log(await response.json());
          form.reset();
          showAllBlogs();
        }catch(error){console.log(error.message)}
      }
      createblog(data);
    });

    // Get All Blogs
    async function allblog(){
      try{
        let response = await fetch('https://ewl-server.vercel.app/api/v1/blog/all');
        let data = await response.json();
        const arr = Object.values(data.blogs);

        arr.forEach((element)=>{
          blogContainer.innerHTML += `
            <div class="card" id="${element._id}">
              <h2>${element.title}</h2>
              <h4>By: ${element.author}</h4>
              <p>${element.content}</p>
              <div class="btn-group">
                <button class="edit" onclick="editBlog('${element._id}', '${element.title}', '${element.author}', '${element.content}')">Edit</button>
                <button class="delete" onclick="deleteBlog('${element._id}')">Delete</button>
              </div>
            </div>`;
        });
      }catch(error){
        console.error('Error fetching blogs:', error);
      }
    }

    // Delete Blog
    async function deleteBlog(blogId){
      if(!confirm("Are you sure you want to delete this blog?")) return;
      try{
        const response = await fetch("https://ewl-server.vercel.app/api/v1/blog/deleteById", {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({id: blogId}),
        });
        const result = await response.json();
        if(result.message === "Blog deleted successfully"){
          document.getElementById(blogId).remove();
        }
      }catch(error){console.log("Error deleting blog:", error);}
    }

    // Edit Blog (populate form)
    function editBlog(id, title, author, content){
      showCreateBlogForm();
      document.getElementById("title").value = title;
      document.getElementById("Author").value = author;
      document.getElementById("Content").value = content;
      // You can implement update API here same like create
    }

    showAllBlogs();
  