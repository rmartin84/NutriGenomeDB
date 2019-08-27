class PatientsController < ApplicationController
	before_action :set_patient, only: [:show, :edit, :update, :destroy]

	# GET /patients
	# GET /patients.json
	def find_job
	@url=params[:ide]
	if File.exist?("#{Rails.root}/public/#{@url}/index.html")
	@a||= Dir.glob("#{Rails.root}/public/#{@url}/gsea_report_for_na_pos_*.xls")
	@a1 =@a.to_s.delete('[]')
	@a2 =@a1.delete('""')
	@target||= File.read(@a2)
	@target1= CSV.parse(@target, :headers => true, :col_sep => "\t")
	redirect_to "/#{@url}"
	#@target= "results/#{@job}/gsea_report_for_na_pos*"
	##render :file => "/home/rmartin/preditest/results/fe30a8b3-b5ee-4afc-b336-33b64bbcc873/gsea_report_for_na_pos_1467200995861.html"
	else 
		redirect_to "/error"
	end
end

	def index
		@patients = Patient.all
	end

	# GET /patients/1
	# GET /patients/1.json
	def show
	require 'spreadsheet'	
	require 'csv'
	require 'nokogiri'

	@job=params[:id]
	@ide=params[:job]
	 
	system("mv #{Rails.root}/public/$(ls -t #{Rails.root}/public  | head -1) #{Rails.root}/public/#{@job}")
	
	if File.exist?("#{Rails.root}/public/#{@job}/index.html")
    @a||= Dir.glob("#{Rails.root}/public/#{@job}/gsea_report_for_na_pos_*.xls")
    @a1 =@a.to_s.delete('[]')
    @a2 =@a1.delete('""')
    @target||= File.read(@a2)
    @target1= CSV.parse(@target, :headers => true, :col_sep => "\t")

    @twofiles = Dir["#{Rails.root}/public/#{@job}/gsea_report_for_*.xls"]
    @twofiles_data = @twofiles.map {|tf| CSV.read(tf)}


    @csv_string = CSV.generate do |csv|
    csv << @target1.headers
    @twofiles_data.each do |data|
    data.shift
    data.each do |row|
    csv << row
end
end
end
#@data||= File.read(@csv_string)
@data2 = CSV.parse(@csv_string, :headers => true, :col_sep => "\t")

	##redirect_to "/#{@job}"
	#@target= "results/#{@job}/gsea_report_for_na_pos*"
	##render :file => "/home/rmartin/preditest/results/fe30a8b3-b5ee-4afc-b336-33b64bbcc873/gsea_report_for_na_pos_1467200995861.html"
	else 
		redirect_to "/error"
	end
		system("mv #{Rails.root}/testA.rnk #{Rails.root}/public/#{@job}")
		system("sed -i 's/-*//g' #{Rails.root}/public/#{@job}")

end

	# GET /patients/new
	def new
	end

	def heatmap
		job = params[:job]
		q = params[:symbol_name]
		q.upcase!
		genes = q.gsub(";", " ")
		genes1 = genes.inspect
		aver = "#{Rails.root}/public/#{@job}/gsea_report_for_*.xls"
		aver1 = aver.inspect
		print(aver1)
		system("/opt/python-3.6/bin/python3 heatmap.py #{genes1}")
		#archivo = Time.now
		render :heatmap
		#send_file "/home/rmartin/Downloads/heatmap1.pdf", filename: "heatmap-#{archivo}.pdf", type: 'application/pdf'
	end

	def query_results

		@@q = params[:symbol_name]
		@@q.upcase!
		if @@q.include? ";"
		genes=@@q.split(";")
		query = ""
		index = 0
		genes.each do |genes1|
			if index == 0
				query = "symbol = '#{genes1}'"
			else 
				query += "or symbol = '#{genes1}'"
				#like '%#{genes1}%'"
			end
			index += 1
		end
		@result = Nutrigenomic.where(query)
		else
		@result = Nutrigenomic.where("symbol = '#{@@q}'")
		end
def scatter
		genes = @@q.gsub(";", " ")
		genes.upcase!
		genes1 = genes.inspect
		system("/opt/python-3.6/bin/python3 plot2.py #{genes1}")
		#archivo = Time.now
		#render_to_string(:file => "basic-bar.html", :layout => nil).html_safe
		plotname = Dir.glob("./public/*").max_by {|f| File.mtime(f)}
		plotname.gsub!("./public","")
		#send_file "#{Rails.root}/#{plotname}", :type=> 'text/html',:disposition => 'attachment'
		redirect_to "#{plotname}"
	end

	end


	def home
	end

	def search
	end

	# GET /patients/1/edit
	def edit
	end

	# POST /patients
	# POST /patients.json
	def create
			require 'securerandom'
	 @job= SecureRandom.uuid
	ids_up= params[:ids_up]
	name=params[:name]
	organism=params[:organism]
	@list= ids_up.split('\n')
	File.open("testA.rnk", "w") do |file|
	@list.each do |v|	
	file.puts (v)


end
end

	 tar = File.open("testA.rnk").readlines.size





		require 'open3'
			if organism == "Homo_sapiens"
		  system("java -cp gsea2-2.2.2.jar -Xmx1024m xtools.gsea.GseaPreranked -gmx #{Rails.root}/NutriGeneset.gmt -collapse false -mode Max_probe -norm meandiv -nperm 1000 -rnk #{Rails.root}/testA.rnk -scoring_scheme weighted -rpt_label preditest_analysis -include_only_symbols true -make_sets true -plot_top_x 300 -rnd_seed 21101984 -set_max 3000 -set_min 1 -zip_report false -out #{Rails.root}/public") 
			
			else
			system("gseapy prerank -r test.rnk -g NutriGeneset.gmt -o results/#{@job} --min-size 0 --max-size 100000")
		 end
	
	

		 redirect_to "/patients/#{@job}"

	end

	def enrichment
		nombreArchivo  = params[:archivo1]
		job = params[:job]

		if File.exist?("#{Rails.root}/public/#{@job}/#{nombreArchivo}_genes.xls")
		system("#{Rails.root}/app/assets/enrichment.sh \"#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls\" > temporal.txt")
		

		else
		require 'csv'
		  if File.exist?("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")   
	tar1= File.read("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")
        archivo=CSV.parse(tar1, :headers => true, :col_sep => "\t")
        archivo1=archivo["PROBE"]
  	    File.open("#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", "w") do |file1|
	    archivo1.each do |vt|	
	    file1.puts (vt)
	end
	end
		system("#{Rails.root}/app/assets/enrichment.sh \"#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls\" > temporal.txt")
	
send_file "temporal.txt", filename: "#{nombreArchivo}_geneFunction.txt", type: "application/csv"
else
	flash[:success] = "There was an error processing the requested file, please try another query"
	redirect_to "/patients/#{job}"



end	
end
end
	def download
		require 'csv'

		 nombreArchivo  = params[:archivo1]
		 job = params[:job]

  if File.exist?("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")   

  tar1= File.read("#{Rails.root}/public/#{job}/#{nombreArchivo}.xls")

  archivo=CSV.parse(tar1, :headers => true, :col_sep => "\t")
  archivo1=archivo["PROBE"]
  	File.open("#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls", "w") do |file1|
	archivo1.each do |vt|	
	file1.puts (vt)
end
end
puts("hello")
query_file = "#{Rails.root}/public/#{job}/#{nombreArchivo}_genes.xls"
matched_file = "#{Rails.root}/db_clean/#{nombreArchivo}.xls"
query_file1 = query_file.inspect
matched_file1 = matched_file.inspect

  nombreArchivo1 = nombreArchivo.inspect
	system("/opt/python-3.6/bin/python3 merge.py #{query_file1} #{matched_file1} #{job} > out 2>error ")
    system("mv #{Rails.root}/public/#{job}/results_merged.txt public/#{job}/#{nombreArchivo1}_matched.xls")
  
  		#render file: "prueba.xls", layout: false, content_type: "application/force-download"
		send_file "#{Rails.root}/public/#{job}/#{nombreArchivo}_matched.xls", filename: "#{nombreArchivo}_matched.xls", type: 'application/xls'


else
	flash[:success] = "There was an error processing the requested file, please try another query"
	redirect_to "/patients/#{job}"

end
end


	# PATCH/PUT /patients/1
	# PATCH/PUT /patients/1.json
	def update
		respond_to do |format|
			if @patient.update(patient_params)
				format.html { redirect_to @patient, notice: 'Patient was successfully updated.' }
				format.json { render :show, status: :ok, location: @patient }
			else
				format.html { render :edit }
				format.json { render json: @patient.errors, status: :unprocessable_entity }
			end
		end
	end

	# DELETE /patients/1
	# DELETE /patients/1.json
	def destroy
		@patient.destroy
		respond_to do |format|
			format.html { redirect_to patients_url, notice: 'Patient was successfully destroyed.' }
			format.json { head :no_content }
		end
	end

	private
		# Use callbacks to share common setup or constraints between actions.
		def set_patient
			require 'securerandom'
		id1= SecureRandom.uuid
			if File.exist?("results/#{@name}/gseapy_reports.csv")
		redirect_to "/#{id1}"
		end
end

		# Never trust parameters from the scary internet, only allow the white list through.
		def patient_params
			params.require(:patient).permit(:age, :gender, :weight, :city, :number_of)
		end

end
