package be.ttime.core.controller;

import be.ttime.core.error.ResourceNotFoundException;
import be.ttime.core.persistence.model.FileEntity;
import be.ttime.core.persistence.service.IFileService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Controller
@RequestMapping(value = "/download")
public class FileDownloadController {

    @Autowired
    private Environment env;

    @Autowired
    private IFileService pageFileService;

    @RequestMapping(value = "/{name}", method = RequestMethod.GET)
    public void downloadFileByName(HttpServletResponse response, @PathVariable("name") String name, Boolean force) throws Exception {

        FileEntity file = pageFileService.findServerName(name);
        download(response, file, force);
    }

    @RequestMapping(value = "/id/{id}", method = RequestMethod.GET)
    public void downloadFileById(HttpServletResponse response, @PathVariable("id") Long id, Boolean force) throws Exception {

        FileEntity file = pageFileService.findOne(id);
        download(response, file, force);

    }

    private void download(HttpServletResponse response, FileEntity pageFile, Boolean force) throws Exception {


        if (pageFile == null) {
            throw new ResourceNotFoundException();
        }

        String appPath = env.getProperty("page.file.directory");

        File file = new File(appPath + pageFile.getServerName());
        System.out.println(file.toString());

        if (!file.exists()) {
            throw new ResourceNotFoundException("File not found " + file.getAbsolutePath());
        }

        String mimeType = (!StringUtils.isEmpty(pageFile.getMimeType()) && !Boolean.TRUE.equals(force)) ? pageFile.getMimeType() : "application/octet-stream";
        response.setContentType(mimeType);

        /* "Content-Disposition : inline" will show viewable types [like images/text/pdf/anything viewable by browser] right on browser
            while others(zip e.g) will be directly downloaded [may provide save as popup, based on your browser setting.]*/
        /* "Content-Disposition : attachment" will be directly download, may provide save as popup, based on your browser setting*/
        response.setHeader("Content-Disposition", "inline; filename=\"" + pageFile.getName() + "." + pageFile.getExtension() + "\"");

        response.setContentLength((int) file.length());

        InputStream inputStream = new BufferedInputStream(new FileInputStream(file));

        //Copy bytes from source to destination(outputstream in this example), closes both streams.
        FileCopyUtils.copy(inputStream, response.getOutputStream());
    }
}